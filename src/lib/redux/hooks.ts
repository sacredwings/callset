// app/hooks.ts
// 'use client'; // Не требуется, если хуки используются только в клиентских компонентах
'use client'; // <-- НУЖНО ЗДЕСЬ

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store'; // Импортируем AppDispatch и RootState

// Типизированные хуки для Redux

// Используем AppDispatch для возможности отправки асинхронных действий (thunks)
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Используем useSelector.withTypes<RootState>() для безопасного доступа к состоянию
export const useAppSelector = useSelector.withTypes<RootState>();