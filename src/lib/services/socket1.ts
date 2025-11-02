// @ts-nocheck
import io, { Socket } from 'socket.io-client'
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import {
    socketConnect,
    socketDisconnect,
} from '@/lib/redux/slices/socket'
import {CallEnd, CallStart, GetOffer, getPeer, SetOffer, Signal} from '@/lib/services/peer'
import {openModal} from "@/lib/redux/slices/peer";
import { addToastSystem } from '@/lib/services/toastSystem'
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

    //может возникнуть как при разрыве так и при завершении авторизации
    socketInstance.on('disconnect', () => {
        console.log(`WebSocket disconnected!`);
        store.dispatch(socketDisconnect());
        socketInstance = null; //Сброс инициализации

        //socketInstance.connect()
    });

    socketInstance.on('offerСanceled', (userSenderId) => {
        console.log(`offerСanceled !`);

        //нужно проверить по пользователю
        CallEnd()
        //store.dispatch(socketDisconnect());
        //socketInstance = null; // Можно сбросить здесь, но лучше в disconnectSocket()
    });

    // --- WebRTC Signaling Handlers ---
    socketInstance.on('offer', async (offer, userSenderId, sucketSenderId) => {
        console.log(`Получаю offer от: ${userSenderId}, ${sucketSenderId} - Входящий звонок`);

        await CallStart ({
            receiverId: userSenderId,
            isInitiator: false,
            video: true,
            audio: true
        })

        console.log('Готов отправить offer')
        SetOffer(offer)
        console.log('Отправил offer')
    });

    socketInstance.on('answer', (answer) => {
        console.log('Получен answer');
        Signal(answer)
    });

    socketInstance.on('candidate', (candidate) => {
        console.log('Получен candidate');
        Signal(candidate)
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

    if (!auth || !auth.tid || !auth.tkey) {
        console.log('Нет auth для подключения WebSocket')
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
    if (!socketInstance) {
        console.log('WebSocket пытается соединиться, но инициализация не пройдена')
        return
    }

    const socketState = store.getState().socket

    if (socketState.isConnected) {
        console.log('WebSocket уже подключен')
        return
    }

    console.log('WebSocket не подключен, подключаю')
    socketInstance.connect()

    //addToastSystem({code: 0, msg: 'Socket подключен'})
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

    //addToastSystem({code: 1, msg: 'Socket отключен'})
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