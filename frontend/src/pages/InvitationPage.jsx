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

    toast.promise(
      async () => {
        setConfirming(true);
        try {
          const data = await invitationService.confirm(id);
          setInvitation(data.invitation);
          setConfirmed(true);
          return data;
        } finally {
          setConfirming(false);
        }
      },
      {
        loading: 'Confirmando asistencia...',
        success: () => {
          return '¡Listo! Tu asistencia ha sido confirmada 🎉';
        },
        error: 'No se pudo confirmar. Intenta de nuevo',
      }
    );
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-neutral-900">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <span className="loading loading-spinner loading-lg text-rose-300"></span>
          </div>
          <p className="text-white mt-6 text-lg font-serif italic animate-pulse">
            Preparando tu invitación...
          </p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-neutral-900">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        <div className="card w-full max-w-md bg-white shadow-2xl relative z-10">
          <div className="card-body text-center p-8">
            <div className="text-6xl mb-4">🥀</div>
            <h1 className="text-2xl font-bold text-gray-800 font-serif">Invitación no encontrada</h1>
            <p className="text-gray-600 mt-4">
              {error || 'Esta invitación no existe o ha sido eliminada'}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Si crees que esto es un error, contacta con quien te envió la invitación
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-900">
      {/* Imagen de fondo de rosas reales */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80')`,
        }}
      ></div>
      
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      {/* Viñeta en los bordes */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-2xl">
          
          {/* Card principal con efecto de papel real */}
          <div className="relative">
            {/* Decoración de esquinas doradas */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-amber-400 opacity-80 z-10"></div>
            <div className="absolute -top-3 -right-3 w-16 h-16 border-t-4 border-r-4 border-amber-400 opacity-80 z-10"></div>
            <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-4 border-l-4 border-amber-400 opacity-80 z-10"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-amber-400 opacity-80 z-10"></div>

            {/* Papel texturizado */}
            <div 
              className="relative bg-cover bg-center shadow-2xl"
              style={{
                backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')`,
                backgroundColor: '#fdfbf7',
              }}
            >
              <div className="p-8 md:p-12 border-8 border-double border-amber-600/30">
                
                {/* Header ornamental */}
                <div className="text-center mb-8">
                  <div className="inline-block">
                    {/* Decoración superior */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-700 to-amber-700"></div>
                      <div className="text-amber-700 text-3xl">❦</div>
                      <div className="w-20 h-[2px] bg-gradient-to-l from-transparent via-amber-700 to-amber-700"></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      XV Años
                    </h1>
                    
                    {/* Decoración inferior */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-700 to-amber-700"></div>
                      <div className="text-amber-700 text-3xl">❦</div>
                      <div className="w-20 h-[2px] bg-gradient-to-l from-transparent via-amber-700 to-amber-700"></div>
                    </div>
                  </div>
                </div>

                {/* Frase elegante */}
                <div className="text-center mb-8 px-4">
                  <p className="text-lg md:text-xl font-serif italic text-amber-900/80 leading-relaxed">
                    "Con la bendición de Dios y mis padres,
                    <br />
                    tengo el honor de invitarte a celebrar
                    <br />
                    este momento tan especial en mi vida"
                  </p>
                </div>

                {/* Línea decorativa */}
                <div className="flex items-center justify-center gap-3 my-6">
                  <div className="w-12 h-[1px] bg-amber-700/40"></div>
                  <div className="text-amber-700">✦</div>
                  <div className="w-12 h-[1px] bg-amber-700/40"></div>
                </div>

                {/* Nombre de la quinceañera */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-rose-700 via-rose-600 to-rose-800 mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {invitation.familia}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="text-amber-700 text-sm">✿</div>
                    <p className="text-amber-900/70 font-serif italic text-sm">Quinceañera</p>
                    <div className="text-amber-700 text-sm">✿</div>
                  </div>
                </div>

                {/* Información de pases */}
                <div className="bg-gradient-to-br from-amber-50/50 to-rose-50/50 border-2 border-amber-300/50 rounded-lg p-6 mb-8 shadow-inner">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center gap-3 bg-white/70 rounded-full px-6 py-3 shadow-md border border-amber-200/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-amber-800/70 font-serif mb-0.5">Pases para</p>
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-rose-700">
                          {invitation.personas}
                        </p>
                        <p className="text-xs text-amber-800/70 font-serif mt-0.5">
                          {invitation.personas === 1 ? 'persona' : 'personas'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado de confirmación */}
                {confirmed || invitation.confirmado ? (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-lg p-6 md:p-8 shadow-lg">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-emerald-800 mb-2">
                        ¡Confirmado!
                      </h3>
                      <p className="text-emerald-700 mb-3">
                        Gracias por confirmar tu asistencia
                      </p>
                      {invitation.confirmadaEn && (
                        <p className="text-xs text-emerald-600/80 mb-4 font-serif">
                          Confirmado el: {formatDate(invitation.confirmadaEn)}
                        </p>
                      )}
                      <div className="bg-white/80 rounded-lg p-4 mt-4 border border-emerald-200">
                        <p className="text-lg font-serif italic text-emerald-800">
                          "Será un honor y una alegría compartir
                          <br />
                          este día tan especial contigo"
                        </p>
                      </div>
                      <p className="mt-6 text-emerald-700 font-semibold text-lg">
                        ¡Nos vemos en la fiesta! 🎊
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-base md:text-lg font-serif text-amber-900/80 mb-6 leading-relaxed px-4">
                      Por favor, confirma tu asistencia
                      <br />
                      <span className="text-sm text-amber-800/60 italic">
                        para que podamos preparar todo con cariño
                      </span>
                    </p>
                    
                    {/* Botón realista con efecto 3D */}
                    <button 
                      onClick={handleConfirm} 
                      disabled={confirming}
                      className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-serif font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(to bottom, #f43f5e 0%, #e11d48 50%, #be123c 100%)',
                        boxShadow: '0 8px 0 #881337, 0 12px 20px rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        transform: confirming ? 'translateY(4px)' : 'translateY(0)',
                        border: '2px solid rgba(255,255,255,0.2)',
                      }}
                      onMouseDown={(e) => !confirming && (e.currentTarget.style.transform = 'translateY(4px)', e.currentTarget.style.boxShadow = '0 4px 0 #881337, 0 6px 10px rgba(0,0,0,0.3)')}
                      onMouseUp={(e) => !confirming && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 8px 0 #881337, 0 12px 20px rgba(0,0,0,0.3)')}
                      onMouseLeave={(e) => !confirming && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 8px 0 #881337, 0 12px 20px rgba(0,0,0,0.3)')}
                    >
                      {confirming ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          Confirmar mi Asistencia
                        </>
                      )}
                    </button>
                    
                    <p className="text-xs text-amber-800/50 mt-6 font-serif italic px-4">
                      Tu confirmación es muy importante para nosotros
                    </p>
                  </div>
                )}

                {/* Footer decorativo */}
                <div className="mt-10 pt-6 border-t-2 border-amber-300/40">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="text-amber-700 text-sm">✿</div>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                    <div className="text-rose-600 text-lg">♡</div>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                    <div className="text-amber-700 text-sm">✿</div>
                  </div>
                  <p className="text-center font-serif italic text-amber-900/70 text-sm">
                    Con cariño te esperamos
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvitationPage;