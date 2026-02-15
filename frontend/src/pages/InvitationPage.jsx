// src/pages/InvitationPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { invitationService } from '../services/api';

function InvitationPage() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    loadInvitation();
  }, [id]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await invitationService.getPublic(id);
      
      if (!data || !data.invitation) {
        throw new Error('No se recibió la invitación del servidor');
      }
      
      setInvitation(data.invitation);
      
      if (data.invitation.confirmado) {
        setConfirmed(true);
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al cargar la invitación');
      toast.error('No se pudo cargar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!invitation) {
      toast.error('No se ha cargado la invitación');
      return;
    }

    if (confirmed || invitation.confirmado) {
      toast.warning('Esta invitación ya fue confirmada');
      return;
    }

    setConfirming(true);
    try {
      const data = await invitationService.confirm(id);
      setInvitation(data.invitation);
      setConfirmed(true);
    } catch (err) {
      alert('Error al confirmar. Por favor intenta de nuevo.');
    } finally {
      setConfirming(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-white"></span>
          <p className="text-white mt-6 text-lg font-serif italic animate-pulse">
            Cargando invitación...
          </p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
        <div className="card w-full max-w-md bg-white shadow-2xl">
          <div className="card-body text-center p-8">
            <div className="text-6xl mb-4">💔</div>
            <h1 className="text-2xl font-bold text-gray-800 font-serif">Invitación no encontrada</h1>
            <p className="text-gray-600 mt-4">
              {error || 'Esta invitación no existe o ha sido eliminada'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Imagen de fondo - Rosas rosadas hermosas */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&q=90')`,
        }}
      ></div>
      
      {/* Overlay degradado oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/85"></div>

      {/* Contenido - TODO CENTRADO */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          
          {/* Card principal con todo el contenido */}
          <div className="text-center">
            
            {/* MIS XV AÑOS - MÁS GRANDE Y ROSADO */}
            <div className="mb-6">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif tracking-[0.3em] mb-4" style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                background: 'linear-gradient(135deg, #fda4af 0%, #fb7185 50%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(251, 113, 133, 0.5)',
                filter: 'drop-shadow(0 4px 20px rgba(251, 113, 133, 0.4))'
              }}>
                MIS XV
                <br />
                AÑOS
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent to-rose-400"></div>
                <div className="text-rose-300 text-2xl">✦</div>
                <div className="w-20 h-[2px] bg-gradient-to-l from-transparent to-rose-400"></div>
              </div>
            </div>

            {/* Nombre de la quinceañera */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-serif font-light text-white tracking-wide" style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                textShadow: '0 2px 20px rgba(0,0,0,0.8)' 
              }}>
                Esperanza Vásquez
              </h1>
            </div>

            {/* Fecha */}
            <div className="mb-6">
              <div className="inline-block bg-white/5 backdrop-blur-md border border-rose-300/20 rounded-2xl px-10 py-5">
                <p className="text-rose-200 text-sm font-serif tracking-wide mb-1">VIERNES</p>
                <p className="text-6xl font-light text-white">08</p>
                <p className="text-xl text-rose-200 font-serif tracking-wide">AGOSTO 2026</p>
              </div>
            </div>

            {/* BOTÓN DE CONFIRMAR - VISIBLE DESDE EL INICIO */}
            {confirmed || invitation.confirmado ? (
              /* CONFIRMADO */
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border-2 border-rose-300/30 rounded-3xl p-8 mb-6 shadow-2xl">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-rose-400/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-4xl font-serif font-light text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  ¡Asistencia Confirmada!
                </h3>
                
                <p className="text-white/80 text-lg mb-6">
                  Gracias por confirmar
                </p>

                {invitation.confirmadaEn && (
                  <p className="text-rose-300/70 text-sm mb-6">
                    {formatDate(invitation.confirmadaEn)}
                  </p>
                )}

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/90 text-lg leading-relaxed font-light italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "Será un honor y una alegría
                    <br />
                    compartir este día tan especial contigo"
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="text-rose-300 text-2xl">🌹</div>
                  <p className="text-rose-300 text-lg font-serif">¡Te esperamos!</p>
                  <div className="text-rose-300 text-2xl">🌹</div>
                </div>
              </div>
            ) : (
              /* BOTÓN ROSADO ELEGANTE - VISIBLE DESDE EL INICIO */
              <div className="mb-8">
                <button 
                  onClick={handleConfirm} 
                  disabled={confirming}
                  className="w-full group relative overflow-hidden disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '24px',
                    padding: '20px 24px',
                    boxShadow: '0 10px 40px rgba(244, 63, 94, 0.5), 0 0 60px rgba(251, 113, 133, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onTouchStart={(e) => {
                    if (!confirming) {
                      e.currentTarget.style.transform = 'scale(0.96)';
                      e.currentTarget.style.boxShadow = '0 5px 20px rgba(244, 63, 94, 0.5)';
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (!confirming) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(244, 63, 94, 0.5)';
                    }
                  }}
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-active:translate-x-[200%] transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {confirming ? (
                      <>
                        <span className="loading loading-spinner loading-md text-white"></span>
                        <span className="text-white text-xl font-serif font-semibold tracking-wide">Confirmando...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white text-xl font-serif font-semibold tracking-wide">CONFIRMAR ASISTENCIA</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Información adicional - DESPUÉS DEL BOTÓN */}
            <div className="space-y-6">
              
              {/* Dirección */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-white/60 text-xs font-light mb-2 uppercase tracking-wide">Lugar del evento</p>
                    <p className="text-white text-base leading-relaxed font-light">
                      Rancho Cuco Lindo
                      <br />
                      El Cuco, Chirilagua
                      <br />
                      San Miguel
                    </p>
                  </div>
                </div>
              </div>

              {/* Pases */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-white/60 text-xs font-light mb-1">PASES PARA</p>
                    <p className="text-lg text-white/80 font-serif mb-1">{invitation.familia}</p>
                    <p className="text-3xl font-light text-white">{invitation.personas}</p>
                    <p className="text-white/60 text-xs font-light mt-1">
                      {invitation.personas === 1 ? 'PERSONA' : 'PERSONAS'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-rose-300/50 text-sm">✿</div>
                <div className="w-10 h-[1px] bg-rose-300/30"></div>
                <div className="text-rose-300/70">♡</div>
                <div className="w-10 h-[1px] bg-rose-300/30"></div>
                <div className="text-rose-300/50 text-sm">✿</div>
              </div>
              <p className="text-white/50 text-sm font-light italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Con cariño te esperamos
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitationPage;