import { useReducer, useEffect, type PropsWithChildren } from "react";
import { defaultSocketContextState, SocketContextProvider, socketReducer } from "../../../context/SocketContext";
import { useSocket } from "../../../hooks/useSocket";

export interface ISocketContextComponentProps extends PropsWithChildren { }

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const [SocketState, SocketDispatch] = useReducer(socketReducer, defaultSocketContextState);

    const WSS_API_URL = import.meta.env.VITE_WSS_API_URL || import.meta.env.WSS_API_URL || (() => {
        if (typeof window !== 'undefined') {
            const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
            return `${proto}://${window.location.host}`;
        }
        return 'ws://localhost:3000';
    })();

    console.log('Socket WSS_API_URL resolved to:', WSS_API_URL);

    // Create the socket once via hook
    const socket = useSocket(WSS_API_URL, {
        autoConnect: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
    });

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const user = localStorage.getItem('user');

        if (!socket) return;

        if (token && user) {
            // attach query/auth and connect
            try {
                socket.io.opts.query = { token, user };
            } catch (err) {
                console.warn('Failed to set socket query opts', err);
            }
            socket.connect();
            // register the socket in context so other components can use it
            SocketDispatch({ type: 'update_socket', payload: socket });
            console.log('Global socket connected and dispatched to SocketContext');
        } else {
            console.warn('Socket not connected: missing token or user in localStorage');
        }

        return () => {
            try {
                socket.disconnect();
            } catch (err) {
                /* ignore */
            }
        };
    }, [socket, SocketDispatch]);

    return (
        <SocketContextProvider value={{ SocketState, SocketDispatch }}>
            {children}
        </SocketContextProvider>
    );
};

export default SocketContextComponent;