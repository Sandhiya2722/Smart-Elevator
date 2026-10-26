import { Circle, Cog, DoorOpen, Weight, Radio } from 'lucide-react';

function Indicator({ active, label }) {
  return (
    <div className={`sensor-indicator ${active ? 'active' : 'inactive'}`}>
      <Circle size={10} fill="currentColor" />
      <span>{label}</span>
    </div>
  );
}

function HealthItem({ label, status }) {
  const statusClass = status === 'OK' || status === 'ONLINE' ? 'health-ok' : 'health-error';
  return (
    <div className="health-item">
      <span>{label}</span>
      <span className={`health-status ${statusClass}`}>
        <Circle size={8} fill="currentColor" />
        {status}
      </span>
    </div>
  );
}

export default function SensorMonitoring({ sensors }) {
  if (!sensors) return null;

  const { floorSensors, loadSensor, doorSensor, motor, systemHealth } = sensors;

  return (
    <div className="sensor-panel">
      <h3>Sensor Monitoring</h3>

      <div className="sensor-section">
        <h4><Radio size={16} /> Floor Sensors</h4>
        <div className="sensor-grid">
          {floorSensors?.map((sensor) => (
            <div key={sensor.floor} className="sensor-item">
              <span>Floor {sensor.floor} Sensor</span>
              <Indicator active={sensor.status === 'ACTIVE'} label={sensor.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="sensor-section">
        <h4><Weight size={16} /> Load Sensor</h4>
        <div className="sensor-detail">
          <p>Current Load: <strong>{loadSensor?.load} kg</strong></p>
          <p>
            Sensor Status:{' '}
            <span className={`sensor-status ${loadSensor?.status?.toLowerCase()}`}>
              {loadSensor?.status}
            </span>
          </p>
        </div>
      </div>

      <div className="sensor-section">
        <h4><DoorOpen size={16} /> Door Sensor</h4>
        <div className="sensor-detail">
          <Indicator
            active={doorSensor?.status === 'OPEN'}
            label={doorSensor?.status || 'CLOSED'}
          />
        </div>
      </div>

      <div className="sensor-section">
        <h4><Cog size={16} /> Motor Status</h4>
        <div className="sensor-detail">
          <p>
            Motor:{' '}
            <span className={`motor-status ${motor?.motor === 'ON' ? 'on' : 'off'}`}>
              {motor?.motor}
            </span>
          </p>
          <p>
            Direction:{' '}
            <strong>{motor?.direction}</strong>
          </p>
        </div>
      </div>

      <div className="sensor-section">
        <h4>System Health</h4>
        <div className="health-grid">
          <HealthItem label="Floor Sensor" status={systemHealth?.floorSensor} />
          <HealthItem label="Load Sensor" status={systemHealth?.loadSensor} />
          <HealthItem label="Door Sensor" status={systemHealth?.doorSensor} />
          <HealthItem label="Motor" status={systemHealth?.motor} />
          <HealthItem label="Backend" status={systemHealth?.backend} />
        </div>
      </div>
    </div>
  );
}
