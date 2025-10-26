// @ts-nocheck
// app/slices/myUser.ts
// 'use client'; // Не требуется, если slice не содержит клиентских хуков

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cookie from '@/lib/cookie'

// ---- Типы ----
export interface MyUserState {
    auth: boolean;
    _id: string | null;
    login: string | null;
}

// Если AuthPayload содержит только те поля, которые вы устанавливаете в state,
// можно использовать MyUserState напрямую. В противном случае, оставьте AuthPayload.
// В этом примере, мы предположим, что AuthPayload может быть более ограниченным,
// но для упрощения, можно также использовать MyUserState.
// Давайте для ясности оставим AuthPayload, но с небольшим уточнением.
export interface AuthPayload {
    _id: string | null;
    login: string | null;
}

// ---- Начальное состояние ----
const initialState: MyUserState = {
    auth: false,
    _id: null,
    login: null,
};

// ---- Create Slice ----
const myUserSlice = createSlice({
    name: 'myUser',
    initialState,
    reducers: {
        AuthSet(state, action: PayloadAction<MyUserState>) {
            cookie.set('tid=' + action.payload.tokenId, !action.payload.remember)
            cookie.set('tkey=' + action.payload.tokenKey, !action.payload.remember)

            state.auth = true; // Явно устанавливаем auth в true при успешной аутентификации
            state._id = action.payload._id;
            state.login = action.payload.login;


        },
        AuthDel(state) {
            // Явно сбрасываем все поля в начальное состояние
            state.auth = false;
            state._id = null;
            state.login = null;
            // Или, если вы уверены, что всегда хотите сбросить к полному initialState:
            // Object.assign(state, initialState);
        },
        AuthUpdate(state, action: PayloadAction<MyUserState>) {
            return {
                ...state,
                auth: true,
                _id: action.payload._id,
                login: action.payload.login,
            }
        },
    },
});

export const { AuthSet, AuthDel, AuthUpdate } = myUserSlice.actions;
export default myUserSlice.reducer; // Экспортируем функцию-редьюсер