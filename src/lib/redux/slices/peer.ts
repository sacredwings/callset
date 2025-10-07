import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Peer from 'simple-peer';

interface SocketState {
    isModalOpen: boolean //
    localStream: boolean //
    remoteStream: boolean //
    //peerConnection: Peer | null //
    //callStatus: string //
    //offer: RTCSessionDescription | null
    //isInitiator: boolean
    receiverId: string | null
    //callerId: string | null
    //calleeId: string | null,
    //error: string,
}

// Начальное состояние
const initialState: SocketState = {
    isModalOpen: false,
    localStream: false,
    remoteStream: false,
    //peerConnection: null,
    //callStatus: 'Disconnected',
    //offer: null,
    //isInitiator: false,
    receiverId: null,
    //callerId: null,
    //calleeId: null,
    //error: ''
};

export const socketSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
        //Описание: Эта функция (action creator) сообщает Redux, что модальное окно звонка должно быть открыто.
        //Payload (что приходит): Нет явного payload. Действие само по себе является инструкцией.
        //Что меняет в состоянии Redux:
        // isModalOpen: Устанавливает в true.
        //Назначение:
        // UI: Инициирует отображение модального окна на экране.
        // Логика: Сигнализирует о начале процесса звонка.
        openModal(state, action: PayloadAction<{receiverId: string}>) {
            state.isModalOpen = true
            state.receiverId = action.payload.receiverId
            //state.isInitiator = action.payload.isInitiator
        },

        //Описание: Эта функция сообщает Redux, что модальное окно звонка должно быть закрыто.
        //Payload: Нет явного payload.
        //Что меняет в состоянии Redux:
        // isModalOpen: Устанавливает в false.
        // localStream: Устанавливает в null (чтобы очистить локальное видео).
        // remoteStream: Устанавливает в null (чтобы очистить удаленное видео).
        // peerConnection: Устанавливает в null (чтобы безопасно удалить объект Peer).
        // callStatus: Часто сбрасывает в idle или ended.
        //Назначение:
        // UI: Скрывает модальное окно.
        // Ресурсы: Очищает медиапотоки, останавливает треки (localStream.getTracks().forEach(track => track.stop()) происходит в компоненте перед dispatch этого действия), и корректно уничтожает P2P соединение (peerConnection.destroy()).
        // Состояние: Сбрасывает состояние звонка к начальному.
        closeModal(state) {
            state.isModalOpen = false
            state.remoteStream = false
            state.receiverId = null
        },

        //Описание: Эта функция сохраняет полученный локальный медиапоток (видео/аудио с вашей камеры) в состоянии Redux.
        // Payload (что приходит):
        // stream: Объект MediaStream (например, полученный из navigator.mediaDevices.getUserMedia).
        // Что меняет в состоянии Redux:
        // localStream: Устанавливает переданный stream объект.
        //Назначение:
        // UI: Позволяет отобразить ваше видео в локальном окне модального окна.
        // P2P: Этот поток будет передан в simple-peer для отправки удаленной стороне.
        setLocalStream(state) {
            state.localStream = true
        },

        //Описание: Эта функция сохраняет полученный удаленный медиапоток (видео/аудио от собеседника) в состоянии Redux.
        // Payload (что приходит):
        // stream: Объект MediaStream (полученный от собеседника через WebRTC/simple-peer).
        // Что меняет в состоянии Redux:
        // remoteStream: Устанавливает переданный stream объект.
        //Назначение:
        // UI: Позволяет отобразить видео вашего собеседника в соответствующем окне модального окна.
        setRemoteStream(state) {
            state.remoteStream = true
        },

        //Описание: Эта функция сохраняет объект, управляющий P2P соединением (обычно экземпляр simple-peer или RTCPeerConnection), в состоянии Redux.
        // Payload (что приходит):
        // peer: Экземпляр объекта simple-peer (или аналогичной библиотеки/объекта RTCPeerConnection).
        // Что меняет в состоянии Redux:
        // peerConnection: Сохраняет переданный объект peer.
        //Назначение:
        // Доступ: Предоставляет удобный способ получить доступ к объекту P2P соединения из любого компонента, чтобы отправлять сигналы (peer.signal(...)), добавлять ICE кандидаты (peer.addIceCandidate(...)) или закрывать соединение (peer.destroy()).
        /*
        setPeerConnection(state, action: PayloadAction<{peer: Peer}>) {
            state.peerConnection  = action.payload.peer
        },*/


        //Описание: Это действие обрабатывает входящий звонок. Оно сохраняет данные о звонке и сигнализирует системе, что нужно открыть модальное окно для входящего звонка.
        // Payload (что приходит):
        // offer: Объект RTCSessionDescription (содержащий информацию о медиа и кодеках звонящего).
        // callerId: Строка с идентификатором пользователя, который звонит.
        // Что меняет в состоянии Redux:
        // isModalOpen: Устанавливает в true (для показа модального окна).
        // callStatus: Устанавливает в 'incoming'.
        // offer: Сохраняет полученный offer объект.
        // callerId: Сохраняет идентификатор звонящего.
        //Назначение:
        // UI: Отображает модальное окно с информацией о том, кто звонит, и кнопками “Принять” / “Отклонить”.
        // Логика: Сохраняет необходимую информацию для последующего принятия звонка.
        /*
        incomingCallOffer(state, action: PayloadAction<{
            offer: RTCSessionDescription,
            callerId: string
            isModalOpen: boolean
            callStatus: string
        }>) {
            state.isModalOpen = true
            state.callStatus = 'incoming'
            state.offer = action.payload.offer
            state.callerId = action.payload.callerId
        },*/

        //Описание: Эта функция запускает процесс принятия входящего звонка.
        // Payload: Нет явного payload. Использует сохраненные offer и callerId из состояния Redux.
        // Что меняет в состоянии Redux:
        // callStatus: Меняет с 'incoming' на 'connecting' (или 'outgoing' если это ответ на offer).
        // (Возможно, isModalOpen остается true.)
        // (Инициирует getUserMedia и создание peerConnection в компоненте, который обрабатывает это действие.)
        //Назначение:
        // Логика: Запускает асинхронный процесс получения локального потока, создания peerConnection (с initiator: false в случае ответа на offer), сигнализации (peer.signal(offer)) и отправки answer обратно.
        /*
        acceptCall(state, action: PayloadAction<{callStatus : string}>) {
            state.callStatus  = action.payload.callStatus
        },*/

        //Описание: Эта функция инициирует завершение текущего звонка.
        // Payload: Нет явного payload.
        // Что меняет в состоянии Redux:
        // isModalOpen: Устанавливает в false.
        // callStatus: Устанавливает в 'ended' или 'idle'.
        // localStream: Устанавливает в null.
        // remoteStream: Устанавливает в null.
        // peerConnection: Устанавливает в null.
        // offer: Устанавливает в null.
        // callerId: Устанавливает в null.
        // calleeId: Устанавливает в null.
        //Назначение:
        // UI: Закрывает модальное окно.
        // Ресурсы: Триггерит очистку медиапотоков и закрытие P2P соединения (это обычно делается в компоненте, который слушает это действие, вызывая peerConnection.destroy() и останавливая треки).
        // Состояние: Полностью сбрасывает все параметры, связанные с текущим звонком.
        /*
        endCall(state, action: PayloadAction<{peerStatus : string}>) {
            state.isModalOpen = false
            state.callStatus = 'ended' // или 'idle'
            state.localStream = null
            state.remoteStream = null
            state.peerConnection = null
            state.offer = null
            state.callerId = null
            state.calleeId = null
        },*/

        //Описание: Эта функция сообщает об ошибке, произошедшей во время звонка.
        // Payload (что приходит):
        // errorMessage: Строка, описывающая ошибку.
        // Что меняет в состоянии Redux:
        // callStatus: Устанавливает в 'error'.
        // error: Сохраняет строку errorMessage.
        // (Может также инициировать закрытие модального окна или очистку ресурсов, в зависимости от логики.)
        //Назначение:
        // UI: Позволяет отобразить пользователю сообщение об ошибке.
        // Отладка: Помогает понять, что пошло не так.
        /*
        callError(state, action: PayloadAction<{peerStatus : string}>) {
            state.callStatus = 'error'
            state.error = 'Failed to get user media'
        },
*/
        /*
        setPeerStatus(state, action: PayloadAction<{peerStatus : string}>) {
            state.peerStatus  = action.payload.peerStatus
        },*/

    },
});

export const {
    openModal,
    closeModal,
    setLocalStream,
    setRemoteStream,
    //setPeerConnection,
    //incomingCallOffer,
    //acceptCall,
    //endCall,
    //callError
} = socketSlice.actions;
export default socketSlice.reducer;