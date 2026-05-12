import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyRoom = { name: '', capacity: 4, floor_number: 1, has_projector: false, availability_status: 'available', room_type_id: 1 };

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const { data } = await api.get('/rooms');
    setRooms(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, capacity: Number(form.capacity), floor_number: Number(form.floor_number), room_type_id: Number(form.room_type_id) };
    if (editingId) await api.put(`/rooms/${editingId}`, payload);
    else await api.post('/rooms', payload);
    setForm(emptyRoom);
    setEditingId(null);
    await load();
  };

  const edit = (room) => {
    setEditingId(room.id);
    setForm({
      name: room.name,
      capacity: room.capacity,
      floor_number: room.floor_number,
      has_projector: room.has_projector,
      availability_status: room.availability_status,
      room_type_id: room.room_type_id || 1
    });
  };

  const remove = async (id) => {
    await api.delete(`/rooms/${id}`);
    await load();
  };

  return (
    <div className="page-grid">
      <section className="panel">
        <h2>{editingId ? 'Edit Room' : 'Create Room'}</h2>
        <form className="stack-form" onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Capacity<input type="number" min="1" required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></label>
          <label>Floor<input type="number" required value={form.floor_number} onChange={(e) => setForm({ ...form, floor_number: e.target.value })} /></label>
          <label>Type
            <select value={form.room_type_id} onChange={(e) => setForm({ ...form, room_type_id: e.target.value })}>
              <option value="1">Conference Room</option>
              <option value="2">Interview Room</option>
              <option value="3">Training Room</option>
            </select>
          </label>
          <label className="check-row"><input type="checkbox" checked={form.has_projector} onChange={(e) => setForm({ ...form, has_projector: e.target.checked })} /> Has projector</label>
          <label>Status
            <select value={form.availability_status} onChange={(e) => setForm({ ...form, availability_status: e.target.value })}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
          <button>{editingId ? 'Update Room' : 'Create Room'}</button>
        </form>
      </section>
      <section className="panel wide">
        <h2>Rooms</h2>
        <table>
          <thead><tr><th>Name</th><th>Capacity</th><th>Floor</th><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td><td>{room.capacity}</td><td>{room.floor_number}</td><td>{room.RoomType?.name || '-'}</td><td>{room.availability_status}</td>
                <td><button className="secondary" onClick={() => edit(room)}>Edit</button><button className="danger" onClick={() => remove(room.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ManageRooms;
