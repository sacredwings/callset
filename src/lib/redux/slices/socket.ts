// @ts-nocheck
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
    isConnected: boolean
    id: string | null
}

// Начальное состояние
const initialState: SocketState = {
    isConnected: false,
    id: null,
};

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        // Действие при успешном подключении
        socketConnect(state, action: PayloadAction<string>) {
            state.isConnected = true
            state.id = action.payload
        },
        // Действие при отключении
        socketDisconnect(state) {
            state.isConnected = false
            state.id = null
        },
    },
});

export const { socketConnect, socketDisconnect } = socketSlice.actions;
export default socketSlice.reducer;