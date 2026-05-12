import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    const { data } = await api.get('/bookings');
    setBookings(data);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    await load();
  };

  return (
    <section className="panel">
      <h2>Approve Bookings</h2>
      <table>
        <thead><tr><th>Employee</th><th>Room</th><th>Time</th><th>Resources</th><th>Priority</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.User?.name}</td>
              <td>{booking.Room?.name}</td>
              <td>{new Date(booking.start_time).toLocaleString()} to {new Date(booking.end_time).toLocaleString()}</td>
              <td>{booking.Resources?.map((r) => r.name).join(', ') || 'None'}</td>
              <td>{booking.priority}</td>
              <td><StatusBadge value={booking.status} /></td>
              <td>
                {booking.status === 'pending' && (
                  <>
                    <button className="secondary" onClick={() => decide(booking.id, 'approved')}>Approve</button>
                    <button className="danger" onClick={() => decide(booking.id, 'rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ApproveBookings;
