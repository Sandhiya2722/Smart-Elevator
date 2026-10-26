const FLOOR_COUNT = 3;
const FLOOR_DELAY_MS = 1000;
const DOOR_OPEN_MS = 2500;
const MAX_LOAD = 100;

let state = {
  currentFloor: 1,
  targetFloor: null,
  direction: 'IDLE',
  status: 'IDLE',
  door: 'CLOSED',
  load: 0,
  maxLoad: MAX_LOAD,
  motor: 'OFF',
  emergency: false,
};

let trips = [];
let alerts = [];
let tripCounter = 1;
let movementTimer = null;
let doorTimer = null;
let activeTrip = null;

function getState() {
  const elevatorState = {
    currentFloor: state.currentFloor,
    targetFloor: state.targetFloor,
    direction: state.direction,
    elevatorStatus: state.status,
    doorStatus: state.door,
    currentLoad: state.load,
    maximumLoad: state.maxLoad,
    sensorStatus: state.emergency ? 'ERROR' : 'OK',
    emergency: state.emergency,
    motor: state.motor,
  };

  return {
    ...elevatorState,
    status: elevatorState.elevatorStatus,
    door: elevatorState.doorStatus,
    load: elevatorState.currentLoad,
    maxLoad: elevatorState.maximumLoad,
  };
}

function getTrips() {
  return [...trips].reverse();
}

function getAlerts() {
  return [...alerts].reverse();
}

function clearTimers() {
  if (movementTimer) {
    clearInterval(movementTimer);
    movementTimer = null;
  }
  if (doorTimer) {
    clearTimeout(doorTimer);
    doorTimer = null;
  }
}

function addAlert(message, type = 'info') {
  alerts.unshift({
    id: Date.now(),
    message,
    type,
    timestamp: new Date().toISOString(),
  });
  if (alerts.length > 50) alerts.pop();
}

function checkOverload() {
  if (state.load > state.maxLoad) {
    if (state.status === 'MOVING') {
      clearTimers();
      state.direction = 'IDLE';
      state.motor = 'OFF';
    }
    if (state.status !== 'OVERLOAD') {
      state.status = 'OVERLOAD';
      addAlert('Overload detected - movement disabled', 'warning');
    }
    return true;
  }
  if (state.status === 'OVERLOAD') {
    state.status = 'IDLE';
    state.direction = 'IDLE';
    state.motor = 'OFF';
    addAlert('Load normal - elevator ready', 'success');
  }
  return false;
}

function setLoad(load) {
  if (typeof load !== 'number' || load < 0) {
    return { success: false, error: 'Load must be a non-negative number' };
  }
  state.load = Math.round(load);
  checkOverload();
  return { success: true, load: state.load };
}

function randomLoad() {
  const value = Math.floor(Math.random() * 121);
  return setLoad(value);
}

function openDoorAndComplete() {
  state.status = 'ARRIVED';
  state.door = 'OPEN';
  state.motor = 'OFF';
  state.direction = 'IDLE';

  doorTimer = setTimeout(() => {
    state.door = 'CLOSED';
    state.status = state.load > state.maxLoad ? 'OVERLOAD' : 'IDLE';
    state.targetFloor = null;

    if (activeTrip) {
      activeTrip.endTime = new Date().toISOString();
      activeTrip.duration = new Date(activeTrip.endTime) - new Date(activeTrip.startTime);
      activeTrip.status = 'Completed';
      trips.push(activeTrip);
      activeTrip = null;
    }
  }, DOOR_OPEN_MS);
}

function startMovement(fromFloor, toFloor) {
  state.targetFloor = toFloor;
  state.direction = toFloor > fromFloor ? 'UP' : 'DOWN';
  state.status = 'MOVING';
  state.door = 'CLOSED';
  state.motor = 'ON';

  activeTrip = {
    id: tripCounter++,
    from: fromFloor,
    to: toFloor,
    load: state.load,
    direction: state.direction,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    status: 'In Progress',
  };

  movementTimer = setInterval(() => {
    if (state.emergency) {
      clearTimers();
      return;
    }

    if (checkOverload()) {
      return;
    }

    if (state.direction === 'UP') {
      state.currentFloor += 1;
    } else {
      state.currentFloor -= 1;
    }

    if (state.currentFloor === state.targetFloor) {
      clearInterval(movementTimer);
      movementTimer = null;
      openDoorAndComplete();
    }
  }, FLOOR_DELAY_MS);
}

function moveToFloor(floor) {
  if (state.emergency) {
    return { success: false, error: 'Emergency stop is active. Reset the system first.' };
  }

  if (state.status === 'MOVING') {
    return { success: false, error: 'Elevator is already moving. Please wait.' };
  }

  if (state.load > state.maxLoad) {
    return { success: false, error: 'Overload detected. Reduce load before moving.' };
  }

  const targetFloor = parseInt(floor, 10);
  if (isNaN(targetFloor) || targetFloor < 1 || targetFloor > FLOOR_COUNT) {
    return { success: false, error: `Invalid floor. Must be between 1 and ${FLOOR_COUNT}.` };
  }

  if (targetFloor === state.currentFloor) {
    return { success: false, error: 'Elevator is already on this floor.' };
  }

  if (state.door === 'OPEN') {
    return { success: false, error: 'Please wait for the door to close.' };
  }

  clearTimers();
  startMovement(state.currentFloor, targetFloor);
  addAlert(`Moving from Floor ${state.currentFloor} to Floor ${targetFloor}`, 'info');

  return { success: true, message: `Moving to floor ${targetFloor}`, data: getState() };
}

function emergencyStop() {
  clearTimers();
  state.emergency = true;
  state.status = 'EMERGENCY';
  state.motor = 'OFF';
  state.direction = 'IDLE';
  state.door = 'CLOSED';
  state.targetFloor = null;

  if (activeTrip) {
    activeTrip.endTime = new Date().toISOString();
    activeTrip.duration = new Date(activeTrip.endTime) - new Date(activeTrip.startTime);
    activeTrip.status = 'Aborted';
    trips.push(activeTrip);
    activeTrip = null;
  }

  addAlert('Emergency stop activated', 'emergency');
  return { success: true, message: 'Emergency stop activated', data: getState() };
}

function resetSystem() {
  clearTimers();
  state = {
    currentFloor: 1,
    targetFloor: null,
    direction: 'IDLE',
    status: 'IDLE',
    door: 'CLOSED',
    load: 0,
    maxLoad: MAX_LOAD,
    motor: 'OFF',
    emergency: false,
  };
  activeTrip = null;
  addAlert('System reset to initial state', 'info');
  return { success: true, message: 'System reset successfully', data: getState() };
}

function getCurrentFloor() {
  return state.currentFloor;
}

function getLoad() {
  return state.load;
}

function getDoorStatus() {
  return state.door;
}

function getMotorStatus() {
  return {
    motor: state.motor,
    direction: state.motor === 'ON' ? state.direction : 'STOPPED',
  };
}

module.exports = {
  getState,
  getTrips,
  getAlerts,
  moveToFloor,
  setLoad,
  randomLoad,
  emergencyStop,
  resetSystem,
  getCurrentFloor,
  getLoad,
  getDoorStatus,
  getMotorStatus,
  FLOOR_COUNT,
  MAX_LOAD,
};
