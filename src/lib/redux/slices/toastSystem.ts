//@ts-nocheck
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//интерфейс
interface typeAdd {
    code: number
    msg: string
}
interface typeDel {
    id: number
}

type ToastSystemState = string[]

const initialState = [] as ToastSystemState //массив оповещений
let id: number = 0 //id каждого оповещения

const counterSlice = createSlice({
    name: 'toastSystem',
    initialState,
    reducers: {
        Add (state, action: PayloadAction<typeAdd>) {

            //новый state
            let newState = {
                id: id,
                code: action.payload.code,
                msg: action.payload.msg,
            }

            //увеличение id
            id++

            return [...state, ...[newState]]
        },
        Del (state, action: PayloadAction<typeDel>) {
            let newI
            state.forEach((item, i)=>{
                if (item.id === action.payload.id)
                    newI = i
            })

            state.splice(newI, 1); // начиная с позиции 1, удалить 1 элемент
        }
    },
})

export const { Add, Del } = counterSlice.actions
export default counterSlice.reducer