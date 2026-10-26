import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import ElevatorVisualization from './components/ElevatorVisualization';
import FloorControls from './components/FloorControls';
import LoadControls from './components/LoadControls';
import SensorMonitoring from './components/SensorMonitoring';
import TripHistory from './components/TripHistory';
import EmergencyControls from './components/EmergencyControls';
import {
  getElevatorStatus,
  getSensorStatus,
  getTrips,
  moveElevator,
  resetElevator,
  emergencyStop,
  incrementLoad,
  decrementLoad,
  randomLoad,
  checkHealth,
} from './services/api';

const defaultElevator = {
  currentFloor: 1,
  targetFloor: null,
  direction: 'IDLE',
  elevatorStatus: 'IDLE',
  doorStatus: 'CLOSED',
  currentLoad: 0,
  maximumLoad: 100,
  sensorStatus: 'OK',
  motor: 'OFF',
  emergency: false,
};

export default function App() {
  const [elevator, setElevator] = useState(defaultElevator);
  const [sensors, setSensors] = useState(null);
  const [trips, setTrips] = useState([]);
  const [online, setOnline] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, sensorRes, tripsRes] = await Promise.all([
        getElevatorStatus(),
        getSensorStatus(),
        getTrips(),
      ]);

      setElevator(statusRes.data.data);
      setSensors(sensorRes.data.data);
      setTrips(tripsRes.data.data);
      setOnline(true);
      setError(null);
    } catch {
      setOnline(false);
      setError('Unable to connect to backend. Make sure the server is running on port 5000.');
    }
  }, []);

  useEffect(() => {
    checkHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));

    fetchData();
    const interval = setInterval(fetchData, 500);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleError = (err, fallback) => {
    const message = err?.response?.data?.error || fallback;
    setError(message);
    setTimeout(() => setError(null), 4000);
  };

  const handleSelectFloor = async (floor) => {
    setLoading(true);
    try {
      const response = await moveElevator(floor);
      setElevator(response.data.data);
      await fetchData();
    } catch (err) {
      handleError(err, 'Failed to move elevator');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementLoad = async () => {
    try {
      const response = await incrementLoad();
      setElevator(response.data.elevator);
      await fetchData();
    } catch (err) {
      handleError(err, 'Failed to update load');
    }
  };

  const handleDecrementLoad = async () => {
    try {
      const response = await decrementLoad();
      setElevator(response.data.elevator);
      await fetchData();
    } catch (err) {
      handleError(err, 'Failed to update load');
    }
  };

  const handleRandomLoad = async () => {
    try {
      const response = await randomLoad();
      setElevator(response.data.elevator);
      await fetchData();
    } catch (err) {
      handleError(err, 'Failed to set random load');
    }
  };

  const handleEmergency = async () => {
    try {
      const response = await emergencyStop();
      setElevator(response.data.data);
      await fetchData();
    } catch (err) {
      handleError(err, 'Failed to activate emergency stop');
    }
  };

  const handleReset = async () => {
    try {
      const response = await resetElevator();
      setElevator(response.data.data);
      await fetchData();
    } catch (err) {
      handleError(err, 'Failed to reset system');
    }
  };

  const controlsDisabled =
    !online ||
    loading ||
    elevator.elevatorStatus === 'MOVING' ||
    elevator.elevatorStatus === 'ARRIVED';

  return (
    <div className="app">
      <Header online={online} />

      {error && (
        <div className="toast-error">
          {error}
        </div>
      )}

      <main className="main-content">
        <section className="top-section">
          <StatusCards elevator={elevator} />
        </section>

        <section className="dashboard-grid">
          <div className="left-column">
            <ElevatorVisualization
              currentFloor={elevator.currentFloor}
              direction={elevator.direction}
              status={elevator.elevatorStatus}
            />
            <FloorControls
              currentFloor={elevator.currentFloor}
              status={elevator.elevatorStatus}
              onSelectFloor={handleSelectFloor}
              disabled={!online || loading}
            />
            <EmergencyControls
              status={elevator.elevatorStatus}
              onEmergency={handleEmergency}
              onReset={handleReset}
            />
          </div>

          <div className="right-column">
            <LoadControls
              load={elevator.currentLoad}
              maxLoad={elevator.maximumLoad}
              onIncrement={handleIncrementLoad}
              onDecrement={handleDecrementLoad}
              onRandom={handleRandomLoad}
              disabled={controlsDisabled && elevator.elevatorStatus !== 'OVERLOAD'}
            />
            <SensorMonitoring sensors={sensors} />
          </div>
        </section>

        <section className="bottom-section">
          <TripHistory trips={trips} />
        </section>
      </main>
    </div>
  );
}
