import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyResource = { name: '', type: 'Projector', quantity: 1, status: 'available' };

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(emptyResource);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const { data } = await api.get('/resources');
    setResources(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, quantity: Number(form.quantity) };
    if (editingId) await api.put(`/resources/${editingId}`, payload);
    else await api.post('/resources', payload);
    setForm(emptyResource);
    setEditingId(null);
    await load();
  };

  const edit = (resource) => {
    setEditingId(resource.id);
    setForm({ name: resource.name, type: resource.type, quantity: resource.quantity, status: resource.status });
  };

  const remove = async (id) => {
    await api.delete(`/resources/${id}`);
    await load();
  };

  return (
    <div className="page-grid">
      <section className="panel">
        <h2>{editingId ? 'Edit Resource' : 'Create Resource'}</h2>
        <form className="stack-form" onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Type<input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></label>
          <label>Quantity<input type="number" min="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
          <label>Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>
          <button>{editingId ? 'Update Resource' : 'Create Resource'}</button>
        </form>
      </section>
      <section className="panel wide">
        <h2>Resources</h2>
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>Quantity</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.name}</td><td>{resource.type}</td><td>{resource.quantity}</td><td>{resource.status}</td>
                <td><button className="secondary" onClick={() => edit(resource)}>Edit</button><button className="danger" onClick={() => remove(resource.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ManageResources;
