import { History, ArrowUp, ArrowDown } from 'lucide-react';

export default function TripHistory({ trips }) {
  return (
    <div className="trip-panel">
      <h3>
        <History size={20} />
        Trip History
      </h3>

      {trips.length === 0 ? (
        <p className="no-trips">No completed trips yet.</p>
      ) : (
        <div className="trip-table-wrapper">
          <table className="trip-table">
            <thead>
              <tr>
                <th>Trip</th>
                <th>From</th>
                <th>To</th>
                <th>Load</th>
                <th>Direction</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>#{String(trip.id).padStart(3, '0')}</td>
                  <td>{trip.from}</td>
                  <td>{trip.to}</td>
                  <td>{trip.load} kg</td>
                  <td>
                    <span className={`trip-direction ${trip.direction?.toLowerCase()}`}>
                      {trip.direction === 'UP' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {trip.direction}
                    </span>
                  </td>
                  <td>
                    <span className={`trip-status ${trip.status?.toLowerCase().replace(' ', '-')}`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
