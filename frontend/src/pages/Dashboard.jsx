import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ room_id: '', start_time: '', end_time: '', priority: 'normal', resource_ids: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [roomsRes, resourcesRes, bookingsRes] = await Promise.all([
      api.get('/rooms'),
      api.get('/resources'),
      api.get('/bookings')
    ]);
    setRooms(roomsRes.data);
    setResources(resourcesRes.data);
    setBookings(bookingsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const toggleResource = (id) => {
    const exists = form.resource_ids.includes(id);
    setForm({ ...form, resource_ids: exists ? form.resource_ids.filter((item) => item !== id) : [...form.resource_ids, id] });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await api.post('/bookings', { ...form, room_id: Number(form.room_id) });
      setForm({ room_id: '', start_time: '', end_time: '', priority: 'normal', resource_ids: [] });
      setMessage('Booking request submitted for approval.');
      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create booking');
    }
  };

  if (loading) return <div className="panel">Loading dashboard...</div>;

  return (
    <div className="page-grid">
      <section className="panel wide">
        <h2>Book a Meeting Room</h2>
        {message && <div className={message.includes('submitted') ? 'success' : 'error'}>{message}</div>}
        <form className="grid-form" onSubmit={submit}>
          <label>Room
            <select required value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })}>
              <option value="">Select room</option>
              {rooms.map((room) => <option key={room.id} value={room.id}>{room.name} · {room.capacity} seats</option>)}
            </select>
          </label>
          <label>Start<input type="datetime-local" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></label>
          <label>End<input type="datetime-local" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></label>
          <label>Priority
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          <div className="resource-picker">
            {resources.map((resource) => (
              <label key={resource.id} className="check-row">
                <input type="checkbox" checked={form.resource_ids.includes(resource.id)} onChange={() => toggleResource(resource.id)} />
                {resource.name}
              </label>
            ))}
          </div>
          <button>Submit Booking</button>
        </form>
      </section>
      <section className="panel">
        <h2>Recent Bookings</h2>
        <div className="list">
          {bookings.slice(0, 5).map((booking) => (
            <div className="list-row" key={booking.id}>
              <strong>{booking.Room?.name}</strong>
              <span>{new Date(booking.start_time).toLocaleString()}</span>
              <StatusBadge value={booking.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
