import io, { Socket } from 'socket.io-client'
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import {
    socketConnect,
    socketDisconnect,
} from '@/lib/redux/slices/socket'
import {CallStart, GetOffer, getPeer, SetOffer, Signal} from '@/lib/services/peer'
import {openModal} from "@/lib/redux/slices/peer";
import config from "../../../config.json";

// --- Конфигурация ---
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || config.server; // URL вашего WebSocket сервера

// --- Глобальная переменная для сокет-соединения ---
let socketInstance: typeof Socket | null = null; // <-- Глобальная переменная для самого экземпляра!

// --- Функции для управления сокетом ---

/**
 * Устанавливает обработчики событий для сокета.
 */
const setupSocketEvents = () => {
    const peerState = store.getState().peer
    const peer = getPeer()


    if (!socketInstance) return; // Если экземпляра нет, ничего не делаем

    socketInstance.on('connect', () => {
        console.log('WebSocket connected!');
        store.dispatch(socketConnect(socketInstance?.id ?? null)); // Передаем ID сокета
        console.log('socketId', socketInstance.id)
    });

    socketInstance.on('disconnect', () => {
        console.log(`WebSocket disconnected!`);
        store.dispatch(socketDisconnect());
        // socketInstance = null; // Можно сбросить здесь, но лучше в disconnectSocket()
    });

    // --- WebRTC Signaling Handlers ---
    socketInstance.on('offer', (offer, userSenderId, sucketSenderId) => {
        console.log(`Получаю offer от: ${userSenderId}, ${sucketSenderId} - Входящий звонок`);


        CallStart ({
            receiverId: userSenderId,
            isInitiator: false,
            video: true,
            audio: true
        })

        /*
        store.dispatch(openModal({
            receiverId: userSenderId,
            isInitiator: false
        }))*/


        SetOffer(offer)
    });

    socketInstance.on('answer', (answer) => {
        console.log('Получен answer');
        Signal(answer)
    });
};

/**
 * Инициализирует WebSocket соединение.
 */
export const initializeSocket  = ({
    url,
    auth
}:{
    url: string,
    auth: object
}) => {
    if (socketInstance) {
        console.log('WebSocket уже создан')
        return
    }

    const options: { autoConnect: boolean; query: { tid: string; tkey: string } } = {
        autoConnect: false, // Управление подключением вручную
        query: {
            tid: auth.tid,
            tkey: auth.tkey
        }
    }

    socketInstance = io(url, options)
    setupSocketEvents()
}
/**
 * Устанавливает WebSocket соединение.
 */
export const connectSocket  = () => {
    const socketState = store.getState().socket

    if (socketState.isConnected) {
        console.log('WebSocket уже подключен')
        return
    }

    console.log('WebSocket не подключен, подключаю')
    socketInstance.connect()
}
/**
 * Отключает WebSocket соединение.
 */

export const disconnectSocket = () => {
    const socketState = store.getState().socket

    if (!socketState.isConnected) {
        console.log('WebSocket не подключен')
        return
    }

    console.log('WebSocket подключен, отключаю')
    socketInstance.disconnect()
};

export const getSocket = () => {
    return socketInstance
}

/**
 * Проверяет, подключен ли сокет.
 * @returns {boolean} - True, если сокет подключен, иначе false.
 */
/*
export const isSocketConnected = () => {
    return socket && socket.connected;
};*/

/**
 * Отправляет данные на WebSocket сервер.
 * @param {string} event - Название события.
 * @param {*} data - Данные для отправки.
 */
/*
export const emitSocketEvent = (event, data) => {
    if (!isSocketConnected()) {
        console.warn('Cannot emit event: WebSocket is not connected.');
        // Опционально: можно попытаться переподключиться или продиспатчить ошибку
        // connectSocket(); // Попытка переподключения
        store.dispatch({ type: 'SOCKET_EMIT_ERROR', payload: 'WebSocket not connected' });
        return;
    }
    socket.emit(event, data);
    console.log(`Emitted event "${event}" with data:`, data);
};*/

/*
// --- Экспорт функций ---
export default {
    connectSocket,
    disconnectSocket,
    //isSocketConnected,
    //emitSocketEvent,
};*/