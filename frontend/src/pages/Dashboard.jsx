// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';  // ✅ Import
import { authService, invitationService } from '../services/api';
import CreateInvitationForm from '../components/CreateInvitationForm';
import InvitationList from '../components/InvitationList';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await invitationService.getAll();
      const invitationsList = data.invitations || data.data || [];
      setInvitations(invitationsList);
    } catch (error) {
      console.error('Error al cargar invitaciones:', error);
      toast.error('Error al cargar invitaciones');  // ✅ Toast
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleInvitationCreated = async () => {
    setShowCreateForm(false);
    await loadInvitations();
  };

  const handleDeleteInvitation = (id) => {
    // ✅ CONFIRMACIÓN CON SONNER
    toast.custom(
      (t) => (
        <div className="bg-base-100 shadow-2xl rounded-lg p-6 border-2 border-error max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="font-bold text-xl mb-2">¿Eliminar invitación?</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Esta acción no se puede deshacer. Se eliminará permanentemente.
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  toast.dismiss(t);  // Cerrar el toast
                }}
                className="btn btn-ghost flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t);  // Cerrar el toast
                  confirmDelete(id);  // Ejecutar eliminación
                }}
                className="btn btn-error flex-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,  // No se cierra automáticamente
        position: 'top-center',
      }
    );
  };

  const confirmDelete = async (id) => {
    // ✅ PROMESA CON TOAST
    toast.promise(
      invitationService.delete(id),
      {
        loading: 'Eliminando invitación...',
        success: () => {
          loadInvitations();  // Recargar lista
          return 'Invitación eliminada correctamente';
        },
        error: (err) => {
          return `Error: ${err.message}`;
        },
      }
    );
  };

  const stats = {
    total: invitations.length,
    confirmadas: invitations.filter(inv => inv.confirmado).length,
    pendientes: invitations.filter(inv => !inv.confirmado).length,
    personasConfirmadas: invitations
      .filter(inv => inv.confirmado)
      .reduce((sum, inv) => sum + inv.personas, 0),
    personasTotales: invitations.reduce((sum, inv) => sum + inv.personas, 0),
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">📨 Panel de Invitaciones</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span className="text-xl">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>Hola, {user?.name}</span>
              </li>
              <li><a onClick={handleLogout}>Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Stats */}
        <div className="stats shadow w-full mb-6 stats-vertical lg:stats-horizontal">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </div>
            <div className="stat-title">Total Invitaciones</div>
            <div className="stat-value text-primary">{stats.total}</div>
            <div className="stat-desc">Total de familias invitadas</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="stat-title">Confirmadas</div>
            <div className="stat-value text-success">{stats.confirmadas}</div>
            <div className="stat-desc">Familias que confirmaron</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Pendientes</div>
            <div className="stat-value text-warning">{stats.pendientes}</div>
            <div className="stat-desc">Esperando confirmación</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-title">Personas Confirmadas</div>
            <div className="stat-value text-info">{stats.personasConfirmadas}</div>
            <div className="stat-desc">De {stats.personasTotales} invitadas</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="btn btn-primary gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {showCreateForm ? 'Cancelar' : 'Nueva Invitación'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <CreateInvitationForm 
            onSuccess={handleInvitationCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Lista de invitaciones */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="ml-4">Cargando invitaciones...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No tienes invitaciones creadas</h2>
              <p>Crea tu primera invitación haciendo click en el botón de arriba</p>
            </div>
          </div>
        ) : (
          <InvitationList 
            invitations={invitations}
            onDelete={handleDeleteInvitation}
            onRefresh={loadInvitations}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;