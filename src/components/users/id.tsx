// @ts-nocheck
'use client'
import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {openModal} from "@/lib/redux/slices/peer";


export default function UserId ({id}) {
    const myUser = useAppSelector((state) => state.myUser)
    const dispatch = useAppDispatch()

    console.log()

    const OnClick = () => {
        dispatch(openModal({
            receiverId: id,
            isInitiator: true
        }))
    }

    return (
        <div >
            Пользователь {id}
            <button onClick={OnClick}>Позвонить</button>
        </div>
    )
}