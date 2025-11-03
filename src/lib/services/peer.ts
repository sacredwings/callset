// @ts-nocheck
import Peer from 'simple-peer'
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import {
    openModal,
    closeModal,
    connected,
    setLocalStream,
    setRemoteStream
} from '@/lib/redux/slices/peer'
import { getSocket } from '@/lib/services/socket'

// --- Конфигурация ---

// --- Глобальная переменная для сокет-соединения ---
interface interfaceState {
    peer: typeof Peer | null // <-- Глобальная переменная для самого экземпляра!

    localStream: MediaStream | null // Локальный медиа поток
    remoteStream: MediaStream | null // Удаленный медиа поток
}

// Начальное состояние
export const state: interfaceState = {
    peer: null,

    localStream: null,
    remoteStream: null,
}

// --- Функции для управления Peer ---

/**
 * Устанавливает обработчики событий для peer.
 */
const setupPeerEvents = () => {
    const socketState = store.getState().socket
    const peertState = store.getState().peer
    const socket = getSocket()

    if (!state.peer) return // Если экземпляра нет, ничего не делаем

    state.peer.on('connect', () => {
        console.log('Peer connected!')

        store.dispatch(connected())
    });

    state.peer.on('error', (err) => {
        console.error('Peer connection error:', err)
    });

    state.peer.on('close', () => {
        console.log('Peer closed')

        CallDisconnected() //Обнуляем все
    });

    // Генератор сигналов
    state.peer.on('signal', (data, socketUser, socketId) => {
        const peertState = store.getState().peer // Общие состояния Peer

        console.log('Сгенерирован signal:', data.type)

        // Проверяем тип сигнала
        if (data.type === 'offer') {
            // Если это Offer (только от инициатора)
            console.log(`Sending offer to ${peertState.receiverId}`)
            socket.emit('offer', data, peertState.receiverId) // Отправляем как offer
        } else if (data.type === 'answer') {
            // Если это Answer (только от получателя)
            console.log(`Sending answer to ${peertState.receiverId}`)
            socket.emit('answer', data, peertState.receiverId) // Отправляем как answer
        } else if (data.type === 'candidate') {
            // Если это ICE Candidate
            console.log(`Sending candidate to ${peertState.receiverId}`)
            socket.emit('candidate', data, peertState.receiverId) // Отправляем как candidate
        } else {
            // Другие типы сигналов (например, rollback, session-description)
            // В простых случаях можно их игнорировать или отправлять как generic signal
            console.warn('Unhandled signal type:', data.type)
            // Можно использовать общий обработчик:
            // socket.emit('signal', data, state.receiverId)
        }
    })

    // Срабатывает при получении медиа потока
    state.peer.on('stream', (remoteStream) => {
        console.log('Получен удаленный stream')

        state.remoteStream = remoteStream // Сохраняем удаленный stream
        store.dispatch(setRemoteStream()) // Изменяем состояние, stream получен
    });
};

/**
 * Инициализирует Peer соединение.
 */
export const initializePeer  = async () => {
    const peertState = store.getState().peer

    console.log('initializePeer')

    if (state.peer) {
        console.log('Peer уже создан')
        return
    }

    const options = {
        initiator: peertState.isInitiator,
        stream: state.localStream,
        trickle: true, // Сбор всех ICE кандидатов одновременно
        config: {
            iceServers: [
                { urls: 'stun:stun.stunprotocol.org:3478' },
                { urls: 'stun:stunserver.org:3478' } // Убедитесь, что этот сервер доступен
            ]
        }
    }

    state.peer = await new Peer(options);
    setupPeerEvents()

    console.log('Peer создан')
}

/**
 * Создание медиа потока
 */
export const SetStream = async ({video = true, audio = true}) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
    state.localStream = stream
    store.dispatch(setLocalStream())
}

/**
 * Остановка медиа потока
 */
export const StopStream = () => {
    if (state.localStream)
        state.localStream.getTracks().forEach(track => track.stop())

    state.localStream = null
}
/*
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
}*/

/**
 * Получает локальный медиа поток
 */
export const GetLocalStream = async (videoRef) => {
    return state.localStream
}

/**
 * Получает удаленный медиа поток
 */
export const GetRemoteStream = async () => {
    return state.remoteStream
}

/**
 * Получает peer
 */
export const GetPeer = () => {
    return state.peer
}

/**
 * Устанавливает Signal
 */
export const Signal = (data) => {
    if (!state.peer) {
        console.log('Нет peer чтобы установить signal')
        return
    }

    console.log('Устанавливаю signal')
    state.peer.signal(data)
}

/**
 * Отправка запроса на звонок
 */
export const CallConnecting = async ({isInitiator, receiverId, video, audio}) => {
    const socket = getSocket()

    console.log('CallConnecting')

    console.log('Отправляю запрос на звонок')
    socket.emit('callConnecting', receiverId); // Отправляю запрос на звонок

    // Открываем модальное окно
    store.dispatch(openModal({
        receiverId: receiverId, // Кому звоним
        isInitiator: true, // Запрос на звонок отправляет только инициатор
    }))
}

/**
 * Подтверждение и принятие звонка
 */
export const CallConnected = async () => {
    const peertState = store.getState().peer
    const socket = getSocket()

    console.log('CallConnected')

    console.log('Отправляю ответ на звонок')

    await SetStream({video: true, audio: true}) //настраиваем захват

    await initializePeer() // Инициализируем Peer

    socket.emit('callConnected', peertState.receiverId); // Отправляю подтверждение принятия на звонка
}

export const CallDisconnected = () => {
    const peertState = store.getState().peer
    const socket = getSocket()

    console.log('Закрываю вызов')

    //обрыв соединения
    if (peertState.isConnected)
        state.peer.destroy()

    //если я инициатор, то уведомляем звонящего, что вызов отменен
    if (socket)
        socket.emit('callDisconnected', peertState.receiverId)

    // Закрываем модальное окно
    store.dispatch(closeModal())

    // Обнуление
    state.peer = null

    state.localStream = null
    state.remoteStream = null
}