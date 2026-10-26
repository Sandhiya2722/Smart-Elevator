import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function EmergencyControls({ status, onEmergency, onReset }) {
  const isEmergency = status === 'EMERGENCY';

  return (
    <div className="emergency-panel">
      <button
        className="emergency-btn"
        onClick={onEmergency}
        disabled={isEmergency}
      >
        <AlertOctagon size={20} />
        EMERGENCY STOP
      </button>

      {isEmergency && (
        <div className="alert-box emergency-alert">
          <strong>🚨 EMERGENCY STOP ACTIVE</strong>
          <p>Elevator movement has been stopped.</p>
        </div>
      )}

      <button className="reset-btn" onClick={onReset}>
        <RotateCcw size={18} />
        RESET SYSTEM
      </button>
    </div>
  );
}
