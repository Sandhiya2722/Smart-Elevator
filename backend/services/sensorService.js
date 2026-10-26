const elevatorService = require('./elevatorService');

function getFloorSensors() {
  const currentFloor = elevatorService.getCurrentFloor();
  const sensors = [];

  for (let floor = 1; floor <= elevatorService.FLOOR_COUNT; floor++) {
    sensors.push({
      floor,
      status: floor === currentFloor ? 'ACTIVE' : 'INACTIVE',
    });
  }

  return sensors;
}

function getLoadSensor() {
  const load = elevatorService.getLoad();
  const maxLoad = elevatorService.MAX_LOAD;
  let status = 'NORMAL';

  if (load > maxLoad) {
    status = 'OVERLOAD';
  } else if (load > maxLoad * 0.8) {
    status = 'WARNING';
  }

  return {
    load,
    maxLoad,
    status,
  };
}

function getDoorSensor() {
  return {
    status: elevatorService.getDoorStatus(),
  };
}

function getMotorSensor() {
  return elevatorService.getMotorStatus();
}

function getSystemHealth() {
  const state = elevatorService.getState();

  return {
    floorSensor: state.emergency ? 'ERROR' : 'OK',
    loadSensor: 'OK',
    doorSensor: 'OK',
    motor: state.emergency ? 'ERROR' : 'OK',
    backend: 'ONLINE',
  };
}

function getAllSensors() {
  return {
    floorSensors: getFloorSensors(),
    loadSensor: getLoadSensor(),
    doorSensor: getDoorSensor(),
    motor: getMotorSensor(),
    systemHealth: getSystemHealth(),
  };
}

module.exports = {
  getFloorSensors,
  getLoadSensor,
  getDoorSensor,
  getMotorSensor,
  getSystemHealth,
  getAllSensors,
};
