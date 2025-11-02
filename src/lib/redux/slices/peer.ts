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
};

export const socketSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {

        openModal(state, action: PayloadAction<{receiverId: string, isInitiator: boolean}>) {
            state.isModalOpen = true

            state.isConnecting = true

            state.isInitiator = action.payload.isInitiator
            state.receiverId = action.payload.receiverId
        },

        closeModal(state) {
            state.isModalOpen = false

            state.isConnecting = false
            state.isConnected = false

            state.remoteStream = false
            state.localStream = false

            state.isInitiator = null
            state.receiverId = null
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