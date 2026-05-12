import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/bookings');
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    await api.patch(`/bookings/${id}/cancel`);
    await load();
  };

  if (loading) return <div className="panel">Loading bookings...</div>;

  return (
    <section className="panel">
      <h2>My Bookings</h2>
      <table>
        <thead><tr><th>Room</th><th>Time</th><th>Resources</th><th>Priority</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.Room?.name}</td>
              <td>{new Date(booking.start_time).toLocaleString()} to {new Date(booking.end_time).toLocaleString()}</td>
              <td>{booking.Resources?.map((r) => r.name).join(', ') || 'None'}</td>
              <td>{booking.priority}</td>
              <td><StatusBadge value={booking.status} /></td>
              <td>{booking.status !== 'cancelled' && <button className="secondary" onClick={() => cancel(booking.id)}>Cancel</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default MyBookings;
