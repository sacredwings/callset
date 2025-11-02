// @ts-nocheck
import Peer from 'simple-peer'
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import {
    openModal,
    closeModal,
    setLocalStream,
    setRemoteStream
} from '@/lib/redux/slices/peer'
import { getSocket } from '@/lib/services/socket'

// --- Конфигурация ---

// --- Глобальная переменная для сокет-соединения ---
interface interfaceState {
    peer: typeof Peer | null //
    isConnect: boolean
    isInitiator: boolean | null //
    receiverId: string | null //
    localStream: MediaStream | null //
    remoteStream: MediaStream | null //
    offer: null
}

// Начальное состояние
export const state: interfaceState = {
    peer: null,
    isConnect: false,
    isInitiator: null,
    receiverId: null,
    localStream: null,
    remoteStream: null,
    offer: null,

};

// --- Функции для управления сокетом ---

/**
 * Устанавливает обработчики событий для peer.
 */
const setupPeerEvents = () => {
    const socketState = store.getState().socket
    const peertState = store.getState().peer
    const socket = getSocket()

    if (!state.peer) return // Если экземпляра нет, ничего не делаем

    state.peer.on('connect', () => {
        console.log('Peer connection')

        state.isConnect = true //пир подключен
    });

    state.peer.on('error', (err) => {
        console.error('Peer connection error:', err)
    });

    state.peer.on('close', () => {
        console.log('Peer closed')

        CallEnd() //обнуляем все
    });

    state.peer.on('signal', (data, socketUser, socketId) => {
        console.log('Сгенерирован signal:', data.type)

        /*
        if (data.type === 'offer') {
            // Если это Offer (только от инициатора)
            console.log(`Sending offer to ${state.receiverId}`);
            socket.emit('offer', data, state.receiverId); // Отправляем как offer
        } else if (data.type === 'answer') {
            // Если это Answer (только от получателя)
            console.log(`Sending answer to ${state.receiverId}`);
            socket.emit('answer', data, state.receiverId); // Отправляем как answer
        }
        */


        // Проверяем тип сигнала
        if (data.type === 'offer') {
            // Если это Offer (только от инициатора)
            console.log(`Sending offer to ${state.receiverId}`);
            socket.emit('offer', data, state.receiverId); // Отправляем как offer
        } else if (data.type === 'answer') {
            // Если это Answer (только от получателя)
            console.log(`Sending answer to ${state.receiverId}`);
            socket.emit('answer', data, state.receiverId); // Отправляем как answer
        } else if (data.type === 'candidate') {
            // Если это ICE Candidate
            console.log(`Sending candidate to ${state.receiverId}`);
            socket.emit('candidate', data, state.receiverId); // Отправляем как candidate
        } else {
            // Другие типы сигналов (например, rollback, session-description)
            // В простых случаях можно их игнорировать или отправлять как generic signal
            console.warn('Unhandled signal type:', data.type);
            // Можно использовать общий обработчик:
            // socket.emit('signal', data, state.receiverId);
        }
        /*
        if (state.isInitiator) {
            // Если мы инициатор, отправляем offer
            console.log(`отправляю offer - ${state.receiverId}`)
            socket.emit('offer', data, state.receiverId);
        } else {
            // Если мы не инициатор, отправляем answer
            console.log(`отправляю answer - ${state.receiverId}`)
            socket.emit('answer', data, state.receiverId);
        }*/
    });
    state.peer.on('stream', (remoteStream) => {
        console.log('Получен удаленный stream')

        state.remoteStream = remoteStream //сохраняем удаленный stream
        store.dispatch(setRemoteStream()) //уведомление, что stream получен
    });
};

/**
 * Инициализирует Peer соединение.
 */
export const initializePeer  = ({
    isInitiator,
    receiverId
}:{
    isInitiator: boolean
    //localStream: MediaStream
    receiverId: string
}) => {
    console.log('initializePeer')
    if (state.peer) {
        console.log('Peer уже создан')
        return
    }

    const options = {
        initiator: isInitiator,
        stream: state.localStream,
        trickle: true, // Сбор всех ICE кандидатов одновременно
        config: {
            iceServers: [
                { urls: 'stun:stun.stunprotocol.org:3478' },
                { urls: 'stun:stunserver.org:3478' } // Убедитесь, что этот сервер доступен
            ]
        }
    }
    console.log(options)
    state.peer = new Peer(options);
    state.receiverId = receiverId
    state.isInitiator = isInitiator
    setupPeerEvents()
    console.log('Peer создан')
}

/**
 * Создание медиа потока
 */
export const setStream = async ({video = true, audio = true}) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
    state.localStream = stream
    store.dispatch(setLocalStream())
}

/**
 * Остановка медиа потока
 */
export const stopStream = () => {
    if (state.localStream)
        state.localStream.getTracks().forEach(track => track.stop())

    state.localStream = null
}

export const changeStream = ({video, audio}) => {
    if (!state.localStream) {
        console.warn("changeStream: localStream не существует. Ничего не изменено.");
        return;
    }

    const tracks = state.localStream.getTracks();

    tracks.forEach(track => {
        if (track.kind === 'video') {
            // Применяем новое состояние только если оно передано
            if (typeof video === 'boolean') {
                track.enabled = video;
                console.log(`Видео-трек ${video ? 'включен' : 'выключен'}.`);
            }
        } else if (track.kind === 'audio') {
            // Применяем новое состояние только если оно передано
            if (typeof audio === 'boolean') {
                track.enabled = audio;
                console.log(`Аудио-трек ${audio ? 'включен' : 'выключен'}.`);
            }
        }
    });
}

/**
 * Получает локальный медиа поток
 */
export const getLocalStream = async (videoRef) => {
    return state.localStream
}

/**
 * Получает удаленный медиа поток
 */
export const getRemoteStream = async () => {
    return state.remoteStream
}

/**
 * Получает peer
 */
export const getPeer = () => {
    return state.peer
}

export const Signal = (data) => {
    console.log(state.peer)
    if (!state.peer) {
        console.log('Нет peer чтобы отправить signal')
        return
    }
    console.log('Отправляю signal')
    state.peer.signal(data)
}

/**
 * Устанавливает offer
 */
export const SetOffer = (offer) => {
    state.offer = offer
}

/**
 * Получает offer
 */
export const GetOffer = () => {
    return state.offer
}

export const CallStart = async ({isInitiator, receiverId, video, audio}) => {
    console.log('Открываю вызов')

    //открываем модальное окно
    store.dispatch(openModal({
        receiverId: receiverId, //кому звоним
        isInitiator: isInitiator
    }))

    //получение потока
    //обработка ошибки если устройства нет
    await setStream({video, audio}) //настраиваем захват

    //разрыв стрима при закрытии соединения пира
    //создание peer
    initializePeer({
        isInitiator: isInitiator,
        receiverId: receiverId
    })
}

export const CallEnd = () => {
    const socket = getSocket()

    console.log('Закрываю вызов')

    //закрываем модальное окно
    store.dispatch(closeModal())

    stopStream()

    //обрыв соединения
    if (state.isConnect)
        state.peer.destroy()

    //если я инициатор, то уведомляем звонящего, что вызов отменен
    if (state.isInitiator && socket)
        socket.emit('offerСanceled', state.receiverId);

    //обнуление
    state.peer = null
    state.isConnect = false
    state.isInitiator = null
    state.receiverId = null
    state.localStream = null
    state.remoteStream = null
    state.offer = null
}