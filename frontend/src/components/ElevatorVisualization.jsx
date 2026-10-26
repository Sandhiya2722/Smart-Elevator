import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ElevatorVisualization({ currentFloor, direction, status }) {
  const floors = [3, 2, 1];

  const getCabinPosition = () => {
    const positions = { 1: '0%', 2: '50%', 3: '100%' };
    return positions[currentFloor] || '0%';
  };

  return (
    <div className="elevator-viz">
      <h3>Elevator Shaft</h3>
      <div className="shaft-container">
        <div className="shaft">
          {floors.map((floor) => (
            <div key={floor} className="floor-level">
              <div className="floor-label">
                <span>FLOOR {floor}</span>
                {currentFloor === floor && status !== 'IDLE' && direction !== 'IDLE' && (
                  <span className="floor-indicator">
                    {direction === 'UP' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </span>
                )}
              </div>
              <div className={`floor-line ${currentFloor === floor ? 'active-floor' : ''}`} />
            </div>
          ))}

          <div
            className={`elevator-cabin ${status === 'MOVING' ? 'moving' : ''} ${status === 'ARRIVED' ? 'arrived' : ''}`}
            style={{ bottom: getCabinPosition() }}
          >
            <div className="cabin-door left" />
            <div className="cabin-door right" />
            <span className="cabin-floor">{currentFloor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
