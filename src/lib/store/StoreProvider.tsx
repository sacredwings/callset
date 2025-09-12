// app/StoreProvider.tsx
// 'use client'; // Не требуется, если компонент не использует клиентские хуки React
'use client'; // <-- НУЖНО ЗДЕСЬ

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index'; // Импортируем настроенный store

interface StoreProviderProps {
    children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}