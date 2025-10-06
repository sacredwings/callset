// src/utils/webrtcManager.js
import Peer from 'simple-peer';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import {
    openModal,
    closeModal,
    setLocalStream,
    setRemoteStream,
    setPeerConnection,
    incomingCallOffer,
    acceptCall,
    endCall,
    callError
} from '@/lib/redux/slices/peer';


// --- Глобальные переменные для WebRTC ---
const socket = useAppSelector((state) => state.socket)
const dispatch = useAppDispatch()

// --- Вспомогательные функции ---

/**
 * Получает локальный медиа-поток (камера, микрофон).
 * @returns {Promise<MediaStream>}
 */
const getLocalStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        store.dispatch(setLocalStream(stream)); // Обновляем Redux state
        return stream;
    } catch (error) {
        console.error('Error getting user media:', error);
        store.dispatch(setWebRTCError('Failed to get user media.'));
        throw error;
    }
};

/**
 * Устанавливает обработчики событий для объекта simple-peer.
 * @param {Peer.Instance} peer - Объект simple-peer.
 * @param {AppDispatch} dispatch - Redux dispatch функция.
 */
const setupPeerEvents = (peer, dispatch) => {
    peer.on('signal', (data) => {
        console.log('Signal sent:', data);
        // Отправляем данные сигнализации через сокет
        socketManager.emitSocketEvent('webrtc_signal', data);
        // Можно также сохранить в Redux state, если нужно
        dispatch(setSignalData(data));
    });

    peer.on('connect', () => {
        console.log('WebRTC Peer connected!');
        dispatch(setWebRTCConnectionStatus(true));
    });

    peer.on('data', (data) => {
        console.log('Data received:', data.toString()); // Если передаются строковые данные
        // Обработка получения данных (например, текстовых сообщений)
        dispatch({ type: 'ADD_WEBRTC_DATA', payload: data.toString() });
    });

    peer.on('stream', (stream) => {
        console.log('Remote stream received:', stream);
        remoteStream = stream; // Сохраняем удаленный поток
        dispatch(setRemoteStream(stream)); // Обновляем Redux state
    });

    peer.on('close', () => {
        console.log('WebRTC Peer connection closed.');
        dispatch(setWebRTCConnectionStatus(false));
        dispatch(setRemoteStream(null)); // Очищаем удаленный поток
        peerInstance = null; // Сбрасываем экземпляр
        // Возможно, стоит попытаться переподключиться или показать уведомление
    });

    peer.on('error', (err) => {
        console.error('WebRTC Peer error:', err);
        dispatch(setWebRTCError(err.message));
        dispatch(setWebRTCConnectionStatus(false));
    });
};

/**
 * Инициализирует WebRTC соединение.
 * @param {boolean} isInitiator - Является ли текущий пользователь инициатором.
 * @param {object} socket - Экземпляр сокет-клиента.
 */
export const initializeWebRTCConnection = async (isInitiator = true) => {
    const dispatch = store.dispatch;

    if (peerInstance) {
        console.log('WebRTC connection already in progress or established.');
        return;
    }

    try {
        // Получаем локальный медиа-поток
        localStream = await getLocalStream();

        // Создаем экземпляр simple-peer
        peerInstance = new Peer({
            initiator: isInitiator,
            trickle: false, // Включаем trickle ICE для более быстрого обмена кандидатами
            stream: localStream,
            // Конфигурация для WebRTC, может потребоваться для STUN/TURN серверов
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }, // Публичный STUN сервер
                    // Добавьте свои TURN серверы, если необходимо
                ],
            },
        });

        setupPeerEvents(peerInstance, dispatch);

        // Если мы инициатор, отправляем offer
        if (isInitiator) {
            // Это будет отправлено через сокет при получении 'webrtc_signal'
        }

        // Подписываемся на событие сигнализации от сокета
        // Этот обработчик должен быть установлен ДО инициализации peerInstance,
        // чтобы не пропустить первый сигнал.
        // Поэтому он должен быть либо в socketManager, либо здесь, но вызван
        // ПОСЛЕ установки обработчиков peerInstance.
        // Лучший вариант: установить обработчик в socketManager.js, который диспатчит Redux action,
        // а затем этот manager подписывается на это Redux action и обрабатывает сигнал.
        // Но для простоты, мы можем установить его здесь.

        const handleWebRTCSignal = (data) => {
            console.log('Received WebRTC signal:', data);
            if (peerInstance) {
                peerInstance.signal(data);
            } else {
                console.warn('Peer instance not ready to receive signal.');
                // Возможно, нужно буферизовать сигнал или попытаться повторно инициализировать
            }
        };

        socketManager.socket.on('webrtc_signal', handleWebRTCSignal);

        // Если вы используете async thunk, вам может понадобиться вернуть объект peer
        // или продиспатчить другие actions здесь.
        // В данном случае, мы управляем peerInstance глобально.

    } catch (error) {
        console.error('Failed to initialize WebRTC:', error);
        dispatch(setWebRTCError('Failed to initialize WebRTC connection.'));
    }
};

/**
 * Отправляет данные через WebRTC соединение.
 * @param {any} data - Данные для отправки.
 */
export const sendWebRTCData = (data) => {
    const dispatch = store.dispatch;
    if (peerInstance && store.getState().webrtc.isConnected) {
        peerInstance.send(data);
        console.log('WebRTC data sent:', data);
    } else {
        console.warn('Cannot send WebRTC data: Peer not connected or not initialized.');
        dispatch(setWebRTCError('Cannot send data. WebRTC connection is not active.'));
    }
};

/**
 * Завершает WebRTC соединение.
 */
export const closeWebRTCConnection = () => {
    if (peerInstance) {
        peerInstance.destroy();
        peerInstance = null;
        localStream = null; // Очищаем локальный поток
        remoteStream = null; // Очищаем удаленный поток
        store.dispatch(clearWebRTCState()); // Сбрасываем состояние Redux
        console.log('WebRTC connection closed.');

        // Удаляем слушатель сокета, чтобы избежать утечек
        socketManager.socket.off('webrtc_signal');
    }
};

// --- Экспорт функций ---
export default {
    getLocalStream,
    initializeWebRTCConnection,
    sendWebRTCData,
    closeWebRTCConnection,
};