import { Building2, Wifi } from 'lucide-react';

export default function Header({ online }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <Building2 size={32} className="header-icon" />
          <div>
            <h1>SMART ELEVATOR</h1>
            <p>IoT-Based Elevator Monitoring &amp; Control System</p>
          </div>
        </div>
        <div className={`system-badge ${online ? 'online' : 'offline'}`}>
          <Wifi size={16} />
          <span>{online ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
        </div>
      </div>
    </header>
  );
}
