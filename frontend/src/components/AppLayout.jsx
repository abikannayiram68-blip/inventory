import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarDays, ClipboardCheck, DoorOpen, LayoutDashboard, LogOut, Package, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <DoorOpen size={24} />
          <span>BookSpace</span>
        </div>
        <nav>
          <NavLink to="/"><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/bookings"><CalendarDays size={18} /> My Bookings</NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/rooms"><DoorOpen size={18} /> Rooms</NavLink>
              <NavLink to="/admin/resources"><Package size={18} /> Resources</NavLink>
              <NavLink to="/admin/approvals"><ClipboardCheck size={18} /> Approvals</NavLink>
            </>
          )}
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <div className="user-chip"><UserRound size={18} /> {user?.name} · {user?.role}</div>
          <button className="icon-text" onClick={doLogout}><LogOut size={18} /> Logout</button>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
