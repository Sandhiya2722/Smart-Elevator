export default function FloorControls({ currentFloor, status, onSelectFloor, disabled }) {
  const floors = [1, 2, 3];
  const isBusy = status === 'MOVING' || status === 'ARRIVED';
  const isEmergency = status === 'EMERGENCY';
  const isOverload = status === 'OVERLOAD';

  return (
    <div className="control-panel">
      <h3>Select Destination Floor</h3>
      <div className="floor-buttons">
        {floors.map((floor) => {
          const isCurrent = floor === currentFloor;
          const isDisabled = disabled || isBusy || isEmergency || isOverload || isCurrent;

          return (
            <button
              key={floor}
              className={`floor-btn ${isCurrent ? 'current' : ''}`}
              onClick={() => onSelectFloor(floor)}
              disabled={isDisabled}
              title={
                isCurrent
                  ? 'Already on this floor'
                  : isBusy
                    ? 'Elevator is busy'
                    : isOverload
                      ? 'Overload - reduce load first'
                      : isEmergency
                        ? 'Emergency stop active'
                        : `Go to Floor ${floor}`
              }
            >
              {floor}
            </button>
          );
        })}
      </div>
      {(isBusy || isEmergency || isOverload) && (
        <p className="control-hint">
          {isBusy && 'Elevator is in motion. Please wait...'}
          {isEmergency && 'Emergency stop active. Reset system to continue.'}
          {isOverload && 'Overload detected. Reduce load to enable movement.'}
        </p>
      )}
    </div>
  );
}
