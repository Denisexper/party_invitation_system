// src/components/CreateInvitationForm.jsx
import { useState } from 'react';
import { toast } from 'sonner';  // ✅ Import
import { invitationService } from '../services/api';

function CreateInvitationForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    familia: '',
    personas: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      familia: formData.familia,
      personas: parseInt(formData.personas) || 1,
    };

    // ✅ TOAST PROMISE
    toast.promise(
      invitationService.create(dataToSend),
      {
        loading: 'Creando invitación...',
        success: () => {
          setFormData({ familia: '', personas: '' });
          onSuccess();  // Callback para recargar lista
          return '¡Invitación creada exitosamente! 🎉';
        },
        error: (err) => {
          return `Error: ${err.message}`;
        },
      }
    ).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Nueva Invitación</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Nombre de la Familia</span>
            </label>
            <input
              type="text"
              name="familia"
              value={formData.familia}
              onChange={handleChange}
              placeholder=""
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Número de Personas</span>
            </label>
            <input
              type="number"
              name="personas"
              value={formData.personas}
              onChange={handleChange}
              placeholder=""
              className="input input-bordered w-full"
              required
              min="1"
              max="20"
            />
          </div>

          <div className="card-actions justify-end mt-6">
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Invitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInvitationForm;