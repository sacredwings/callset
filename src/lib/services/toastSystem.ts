// @ts-nocheck
//обработка результатов ответа сервера на запросы
import { store } from '@/lib/redux/store' // <--- !!! ИМПОРТИРУЕМ ГЛОБАЛЬНЫЙ STORE !!!
import { Add, Del } from '@/lib/redux/slices/toastSystem'

export const addToastSystem = ({code, msg}) => {
    store.dispatch(
        Add({
            code,
            msg
        })
    )
}

export const delToastSystem = (id)=> {
    store.dispatch(
        Del({
            id
        })
    )
}

export const getToastSystem = (id)=> {
    return store.getState().toastSystem
}

