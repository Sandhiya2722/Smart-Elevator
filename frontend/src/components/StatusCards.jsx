import {
  ArrowUp,
  ArrowDown,
  Minus,
  DoorOpen,
  DoorClosed,
  Activity,
  Target,
  Weight,
} from 'lucide-react';

function StatusBadge({ status }) {
  const statusClass = {
    IDLE: 'badge-green',
    MOVING: 'badge-yellow',
    ARRIVED: 'badge-blue',
    OVERLOAD: 'badge-red',
    EMERGENCY: 'badge-red',
  }[status] || 'badge-gray';

  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

function DirectionDisplay({ direction }) {
  if (direction === 'UP') {
    return (
      <span className="direction up">
        <ArrowUp size={18} /> UP
      </span>
    );
  }
  if (direction === 'DOWN') {
    return (
      <span className="direction down">
        <ArrowDown size={18} /> DOWN
      </span>
    );
  }
  return (
    <span className="direction idle">
      <Minus size={18} /> IDLE
    </span>
  );
}

export default function StatusCards({ elevator }) {
  const cards = [
    {
      label: 'Current Floor',
      value: elevator.currentFloor,
      icon: Activity,
      color: 'card-blue',
    },
    {
      label: 'Target Floor',
      value: elevator.targetFloor ?? '-',
      icon: Target,
      color: 'card-purple',
    },
    {
      label: 'Direction',
      value: <DirectionDisplay direction={elevator.direction} />,
      icon: elevator.direction === 'UP' ? ArrowUp : elevator.direction === 'DOWN' ? ArrowDown : Minus,
      color: 'card-teal',
      isCustom: true,
    },
    {
      label: 'Elevator Status',
          value: <StatusBadge status={elevator.elevatorStatus} />,
      icon: Activity,
      color: 'card-orange',
      isCustom: true,
    },
    {
      label: 'Door Status',
      value: (
        <span className={`door-status ${elevator.doorStatus === 'OPEN' ? 'open' : 'closed'}`}>
          {elevator.doorStatus === 'OPEN' ? <DoorOpen size={16} /> : <DoorClosed size={16} />}
          {elevator.doorStatus}
        </span>
      ),
      icon: elevator.doorStatus === 'OPEN' ? DoorOpen : DoorClosed,
      color: 'card-indigo',
      isCustom: true,
    },
    {
      label: 'Current Load',
      value: `${elevator.currentLoad} kg / ${elevator.maximumLoad} kg`,
      icon: Weight,
      color: elevator.currentLoad > elevator.maximumLoad ? 'card-red' : 'card-green',
    },
  ];

  return (
    <div className="status-cards">
      {cards.map((card) => (
        <div key={card.label} className={`status-card ${card.color}`}>
          <div className="card-icon">
            <card.icon size={22} />
          </div>
          <div className="card-content">
            <span className="card-label">{card.label}</span>
            <span className="card-value">{card.isCustom ? card.value : card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
