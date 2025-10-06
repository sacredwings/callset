import Peer from 'simple-peer'
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import {
    setRemoteStream
} from '@/lib/redux/slices/peer'
import { getSocket } from '@/lib/services/socket'

// --- Конфигурация ---

// --- Глобальная переменная для сокет-соединения ---
let peerInstance: typeof Peer | null = null; // <-- Глобальная переменная для самого экземпляра!
let isInitiator: boolean | null = null
let receiverId: string | null = null

let localStream: null = null
let remoteStream: null = null

let offer = null
// --- Функции для управления сокетом ---

/**
 * Устанавливает обработчики событий для peer.
 */
const setupPeerEvents = () => {
    const socketState = store.getState().socket
    const peertState = store.getState().peer
    const socket = getSocket()

    if (!peerInstance) return // Если экземпляра нет, ничего не делаем

    peerInstance.on('signal', (data) => {
        console.log('отправляю signal')
        console.log('Sending signal:', data.type)
        if (peertState.isInitiator) {
            // Если мы инициатор, отправляем offer
            // Для простоты, мы не знаем ID другого пользователя, поэтому просто отправляем offer
            // Сервер сигнализации должен будет перенаправить его.
            console.log(`отправляю offer - ${receiverId}`)
            socket.emit('offer', data, receiverId);
        } else {
            // Если мы не инициатор, отправляем answer
            // targetId - это ID инициатора
            console.log(`отправляю answer - ${receiverId}`)
            socket.emit('answer', data, receiverId);
        }
    });
    peerInstance.on('stream', (remoteStream1) => {

        console.log('Получен удаленный stream');

        //console.log(remoteStream)
        remoteStream = remoteStream1
        store.dispatch(setRemoteStream())

        /*
        if (remoteVideoRef) {
            remoteVideoRef.srcObject = remoteStream;
        }
*/
        //setIsConnectedToPeer(true);
        //setPeerStatus(isInitiator ? 'Connected!' : `Connected to ${toId}`);
    });
};

/**
 * Инициализирует WebSocket соединение.
 */
export const initializePeer  = ({
    isInitiator,
    //localStream,
    receiverId: localReceiverId
}:{
    isInitiator: boolean
    //localStream: MediaStream
    receiverId: string
}) => {
    console.log('initializePeer')
    if (peerInstance) {
        console.log('Peer уже создан')
        return
    }

    const options = {
        initiator: isInitiator,
        stream: localStream,
        trickle: false, // Сбор всех ICE кандидатов одновременно
    }
    console.log(options)
    peerInstance = new Peer(options);
    receiverId = localReceiverId
    setupPeerEvents()
}

// --- Функция получения локального медиапотока ---
export const setLocalStream = async (videoRef) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream = stream
        videoRef.srcObject = stream
        return stream;
    } catch (err) {
        console.error('Error accessing media devices:', err);
        //setCallStatus('Error: Could not access camera/microphone.');
        return null;
    }
}; // useCallback, чтобы функция не пересоздавалась без необходимости


// --- Функция установки для передачи удаленного медиапотока ---
export const getRemoteStream = async () => {
    return remoteStream

}; // useCallback, чтобы функция не пересоздавалась без необходимости

export const getPeer = () => {
    return peerInstance
}

export const Signal = (data) => {
    if (!peerInstance) {
        console.log('Нет peer чтобы отправить signal')
        return
    }
    console.log('Отправляю signal')
    peerInstance.signal(data)

}

export const SetOffer = (offer1) => {
    offer = offer1
}

export const GetOffer = () => {
    return offer
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