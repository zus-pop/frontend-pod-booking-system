import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
    const SERVER_URL = import.meta.env.VITE_API_URL;
    if (!socket) {
        socket = io(SERVER_URL, {
            auth: {
                token
            }
        });

        socket.on('connection', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('connect_error', (err) => {
            console.log('Error connecting to server: ', err.message);
        });
    }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.close();
    }
};