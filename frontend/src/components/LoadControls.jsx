import { Minus, Plus, Shuffle } from 'lucide-react';

export default function LoadControls({ load, maxLoad, onIncrement, onDecrement, onRandom, disabled }) {
  const isOverload = load > maxLoad;
  const loadPercent = Math.min((load / maxLoad) * 100, 100);

  return (
    <div className="control-panel load-panel">
      <h3>Load Monitoring</h3>

      <div className="load-display">
        <div className="load-values">
          <div>
            <span className="load-label">Current Load</span>
            <span className={`load-value ${isOverload ? 'overload' : ''}`}>{load} kg</span>
          </div>
          <div>
            <span className="load-label">Maximum Load</span>
            <span className="load-value">{maxLoad} kg</span>
          </div>
        </div>

        <div className="load-bar-container">
          <div
            className={`load-bar ${isOverload ? 'overload' : load > maxLoad * 0.8 ? 'warning' : 'normal'}`}
            style={{ width: `${Math.min((load / maxLoad) * 100, 100)}%` }}
          />
          {load > maxLoad && (
            <div className="load-bar overload-extra" style={{ width: `${((load - maxLoad) / maxLoad) * 100}%` }} />
          )}
        </div>
        <span className="load-percent">{loadPercent.toFixed(0)}% capacity</span>
      </div>

      <div className="load-controls">
        <button className="load-btn" onClick={onDecrement} disabled={disabled || load <= 0} title="Decrease load by 5 kg">
          <Minus size={20} />
        </button>
        <span className="load-current">{load} kg</span>
        <button className="load-btn" onClick={onIncrement} disabled={disabled} title="Increase load by 5 kg">
          <Plus size={20} />
        </button>
      </div>

      <button className="random-load-btn" onClick={onRandom} disabled={disabled}>
        <Shuffle size={16} />
        Random Load
      </button>

      {isOverload ? (
        <div className="alert-box overload-alert">
          <strong>⚠ OVERLOAD DETECTED</strong>
          <p>Current Load: {load} kg</p>
          <p>Maximum Load: {maxLoad} kg</p>
          <p>Elevator movement disabled. Please reduce the load.</p>
        </div>
      ) : (
        <div className="alert-box normal-alert">
          <strong>✓ LOAD NORMAL</strong>
          <p>Elevator Ready</p>
        </div>
      )}
    </div>
  );
}
