// @ts-nocheck
import io, { Socket } from 'socket.io-client'
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import {
    socketConnect,
    socketDisconnect,
} from '@/lib/redux/slices/socket'
import {
    CallDisconnected,
    initializePeer,
    SetStream,
    Signal
} from '@/lib/services/peer'
import {openModal} from "@/lib/redux/slices/peer"
import config from "../../../config.json"

// --- Конфигурация ---
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || config.server.socket // URL вашего WebSocket сервера

// --- Глобальная переменная для сокет-соединения ---
let socketInstance: typeof Socket | null = null // <-- Глобальная переменная для самого экземпляра!

// --- Функции для управления сокетом ---

/**
 * Устанавливает обработчики событий для сокета.
 */
const setupSocketEvents = () => {

    if (!socketInstance) return; // Если экземпляра нет, ничего не делаем

    socketInstance.on('connect', () => {
        console.log('WebSocket connected!')

        store.dispatch(socketConnect(socketInstance?.id ?? null)) // Передаем ID сокета

        console.log('socketId', socketInstance.id)
    })

    // Может возникнуть как при разрыве так и при завершении авторизации
    socketInstance.on('disconnect', () => {
        console.log(`WebSocket disconnected!`)

        store.dispatch(socketDisconnect()) // Сброс store
        socketInstance = null; // Сброс глобального экземпляра
    })

    // Входящий звонок
    socketInstance.on('callConnecting', async (userSenderId, sucketSenderId) => {
        console.log('Принимаю запрос на звонок')
        console.log('Открываю модальное окно')

        // Открываем модальное окно
        store.dispatch(openModal({
            receiverId: userSenderId, // Кто звонит
            isInitiator: false, // Не может быть инициатором, так как принимает запрос на звонок
        }))
    })

    // Подтверждение на принятие звонка
    socketInstance.on('callConnected', async (userSenderId, sucketSenderId) => {
        console.log('Получил подтверждение на принятие звонка')

        await SetStream({video: true, audio: true}) // Захват медиа потока

        initializePeer() // Инициализируем Peer
    })

    // Уведомление о завершении звонка
    socketInstance.on('callDisconnected', (userSenderId) => {
        console.log(`Получил информацию о завершении звонка`);

        // Нужно проверить по пользователю - кто именно прислал
        CallDisconnected() // Сброс Peer
    })

    // --- WebRTC Signaling Handlers ---
    socketInstance.on('offer', async (offer, userSenderId, sucketSenderId) => {
        console.log('Получил и установил - offer')
        Signal(offer)
    });

    socketInstance.on('answer', (answer) => {
        console.log('Получил и установил - answer');
        Signal(answer)
    });

    socketInstance.on('candidate', (candidate) => {
        console.log('Получил и установил - candidate');
        Signal(candidate)
    });
};

/**
 * Инициализирует WebSocket соединение.
 */
export const initializeSocket  = async ({
    tid,
    tkey
}:{
    tid: string,
    tkey: string,
}) => {
    if (socketInstance) {
        console.log('WebSocket уже создан')
        return
    }

    if (!tid || !tkey) {
        console.log('Нет tid/tkey для подключения WebSocket')
        return
    }

    const options: { autoConnect: boolean; query: { tid: string; tkey: string } } = {
        autoConnect: false, // Управление подключением вручную
        query: {
            tid,
            tkey
        }
    }

    // Инициализация WebSocket
    socketInstance = await io(SOCKET_URL, options)

    // Добавление событий
    setupSocketEvents()
}

/**
 * Устанавливает WebSocket соединение.
 */
export const connectSocket  = async () => {
    const socketState = store.getState().socket

    if (!socketInstance) {
        console.log('WebSocket пытается соединиться, но инициализация не пройдена')
        return
    }

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

/**
 * Получение WebSocket соединения, для отправки сообщений.
 */
export const getSocket = () => {
    return socketInstance
}