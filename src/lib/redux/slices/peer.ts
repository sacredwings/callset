// @ts-nocheck
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
    isModalOpen: boolean // модальное окно

    isConnecting: boolean // идет процесс подключения
    isConnected: boolean // подключено

    localStream: boolean
    remoteStream: boolean

    isInitiator: boolean | null
    receiverId: string | null

    video: boolean | null
    audio: boolean | null
}

// Начальное состояние
const initialState: SocketState = {
    isModalOpen: false,

    isConnecting: false,
    isConnected: false,

    localStream: false,
    remoteStream: false,

    isInitiator: null,
    receiverId: null,

    video: null,
    audio: null,
};

export const socketSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {

        openModal(state, action: PayloadAction<{
            receiverId: string,
            isInitiator: boolean,

            video: boolean,
            audio: boolean
        }>) {
            state.isModalOpen = true

            state.isConnecting = true

            state.isInitiator = action.payload.isInitiator
            state.receiverId = action.payload.receiverId

            state.video = action.payload.video
            state.audio = action.payload.audio
        },

        closeModal(state) {
            state.isModalOpen = false

            state.isConnecting = false
            state.isConnected = false

            state.remoteStream = false
            state.localStream = false

            state.isInitiator = null
            state.receiverId = null

            state.video = null
            state.audio = null
        },

        connected(state) {
            state.isConnecting = false
            state.isConnected = true
        },

        setLocalStream(state) {
            state.localStream = true
        },

        setRemoteStream(state) {
            state.remoteStream = true
        }
    }
})

export const {
    openModal,
    closeModal,
    connected,
    setLocalStream,
    setRemoteStream,
} = socketSlice.actions
export default socketSlice.reducer