// app/store.ts
// 'use client'; // Не требуется, если store не содержит клиентских хуков

import { configureStore } from '@reduxjs/toolkit';
import myUserReducer from './slices/myUser'; // Импортируем наш единственный редьюсер

// ---- configureStore ----
export const store = configureStore({
    // Если у вас только один редьюсер, можно передать его прямо так,
    // или как объект, если планируете добавлять другие редьюсеры в будущем.
    reducer: {
        myUser: myUserReducer,
    },
    // Middleware (например, thunk) добавляются configureStore по умолчанию.
    // devTools: process.env.NODE_ENV !== 'production', // Оставьте, если нужен DevTools
});

// ---- Типы ----
// Определяем тип всего состояния Redux.
// ReturnType<typeof store.getState> является самым надежным способом получить тип всего состояния.
export type RootState = ReturnType<typeof store.getState>;
// Тип для dispatch, который позволяет выполнять асинхронные действия (thunks).
export type AppDispatch = typeof store.dispatch;