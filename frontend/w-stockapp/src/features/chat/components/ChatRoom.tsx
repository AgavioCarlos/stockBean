import React, { useState, useRef, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
// @ts-ignore: Vite workaround for typing the dist file
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuth } from '../../../hooks/useAuth';
import { apiFetch } from '../../../services/Api';

// Interface ajustada al Backend (ChatMensajeDTO)
interface ChatMensajeDTO {
  idMensajeChat?: number;
  idChat: number;
  idUsuario: number;
  nombreUsuario?: string;
  contenidoChat: string;
  fechaAltaChat?: string;
}

interface MensajeUI {
  id: string | number;
  texto: string;
  esMio: boolean;
  enviando?: boolean;
  nombre?: string;
  fecha?: string;
}

export const ChatRoom: React.FC = () => {
  const { user } = useAuth(); // Hook para saber quién soy (id_usuario) y mi empresa
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [input, setInput] = useState('');
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [conexionLista, setConexionLista] = useState(false);
  const [idHiloActivo, setIdHiloActivo] = useState(1); // Simulación
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Cargar Historial de Mensajes Oficial de base de datos
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const url = `/api/chat/hilos/${idHiloActivo}/mensajes?size=50`;
        const data = await apiFetch<any>(url);
        
        if (data && data.content) {
          // Spring Data "Page" trae el array dentro de "content".
          // Como viene ORDER BY fecha DESC, le damos vuelta (reverse) para que el más viejo quede arriba
          const historial = data.content.reverse().map((dtoMsg: any) => ({
            id: dtoMsg.idMensajeChat,
            texto: dtoMsg.contenidoChat,
            esMio: dtoMsg.idUsuario === user?.id_usuario,
            enviando: false,
            nombre: dtoMsg.nombreUsuario,
            fecha: dtoMsg.fechaAltaChat
          }));
          setMensajes(historial);
        }
      } catch (error) {
        console.error("Error cargando historial de chat:", error);
      }
    };

    if (user && idHiloActivo) {
      fetchHistorial();
    }
  }, [idHiloActivo, user]);

  // Auto-scroll al final del chat
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Conexión STOMP + SockJS
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Configurar cliente STOMP
    const client = new Client({
      // Adaptar HTTP o HTTPS automáticamente para evitar SecurityError
      webSocketFactory: () => {
        // Obtenemos la URL base (Si usan VITE_API_URL se adapta, si no, usa el host actual / localhost)
        const baseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//localhost:8080`;
        // Forzar HTTPS si la página actual es HTTPS
        const secureUrl = window.location.protocol === 'https:' ? baseUrl.replace('http:', 'https:') : baseUrl;
        return new SockJS(`${secureUrl}/ws-chat`);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setConexionLista(true);
        console.log('Conectado al Chat Server 💬');

        // Suscribirse al tópico del Hilo activo
        client.subscribe(`/topic/hilos/${idHiloActivo}`, (mensajeRecibido) => {
          const body: ChatMensajeDTO = JSON.parse(mensajeRecibido.body);

          setMensajes((prev) => {
            // Remueve el optimistic-ui temporal si es nuestro mensaje y añade el "oficial" de BD
            const prevLimpio = prev.filter(m => !(m.enviando && m.texto === body.contenidoChat));
            return [...prevLimpio, {
              id: body.idMensajeChat || Date.now(),
              texto: body.contenidoChat,
              esMio: body.idUsuario === user?.id_usuario,
              enviando: false,
              nombre: body.nombreUsuario,
              fecha: body.fechaAltaChat
            }];
          });
        });
      },
      onStompError: (frame) => {
        console.error('Error de Broker STOMP:', frame.headers['message']);
        // Manejar reconexión o error visual
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [idHiloActivo, user]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !stompClient || !conexionLista) return;

    // Optimistic UI Temporal
    const tempId = 'temp-' + Date.now();
    setMensajes((prev) => [...prev, {
      id: tempId,
      texto: input,
      esMio: true,
      enviando: true,
      nombre: 'Tú',
      fecha: new Date().toISOString()
    }]);

    // Enviar el mensaje al WebSocket Server (Controller)
    const dtoPayload: ChatMensajeDTO = {
      idChat: idHiloActivo,
      idUsuario: user.id_usuario,
      contenidoChat: input
    };

    stompClient.publish({
      destination: `/app/chat/${idHiloActivo}/enviar`,
      body: JSON.stringify(dtoPayload)
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Contenedor de Mensajes. aria-live anuncia a lectores de pantalla */}
      <div 
        aria-live="polite"
        className="flex-1 p-4 overflow-y-auto flex flex-col gap-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {!conexionLista && (
          <div className="flex items-center justify-center py-4">
               <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <span className="ml-2 text-xs text-gray-500 font-medium">Conectando...</span>
          </div>
        )}

        {mensajes.length === 0 && conexionLista && (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 opacity-60 mt-10">
                <span className="text-3xl mb-2">💬</span>
                <span className="text-xs font-medium">El historial está vacío.</span>
            </div>
        )}
        
        {mensajes.map((msg) => {
           const isMe = msg.esMio;
           return (
             <div 
               key={msg.id} 
               className={`max-w-[85%] flex flex-col mb-1.5 ${isMe ? 'self-end items-end' : 'self-start items-start'} ${msg.enviando ? 'opacity-60' : 'opacity-100'} transition-opacity duration-300`}
             >
                {/* Nombre del emisor si no es el tuyo */}
                {!isMe && msg.nombre && (
                    <span className="text-[11px] text-gray-400/80 ml-1 mb-1 font-medium tracking-wide">
                        {msg.nombre}
                    </span>
                )}

                {/* Burbuja de Mensaje */}
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-snug shadow-sm backdrop-blur-sm border ${
                    isMe 
                      ? 'bg-indigo-600/90 text-white rounded-tr-sm border-indigo-500/50' 
                      : 'bg-white/10 text-gray-200 rounded-tl-sm border-white/5'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.texto}
                </div>

                {/* Fecha y Estado abajo de la burbuja */}
                <div className={`text-[10px] text-gray-500/80 mt-1 flex items-center gap-1.5 ${isMe ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                   {msg.fecha && (
                       <span>
                         {new Date(msg.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                   )}
                   {msg.enviando && <span>• Enviando...</span>}
                </div>
             </div>
           );
        })}
        <div ref={mensajesEndRef} />
      </div>

      {/* Caja de Texto (Formulario) */}
      <form 
        onSubmit={handleSend}
        className="flex items-center p-3 border-t border-white/10 bg-black/20 backdrop-blur-md"
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={conexionLista ? "Escribe un mensaje..." : "Conectando..."}
          disabled={!conexionLista}
          className="flex-1 bg-white/5 border border-white/10 placeholder-gray-500 text-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500/50 transition-all disabled:opacity-50"
          aria-label="Caja de texto de mensaje"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || !conexionLista}
          className={`ml-2 p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
            (input.trim() && conexionLista) 
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 cursor-pointer' 
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Botón enviar mensaje"
          title="Enviar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
