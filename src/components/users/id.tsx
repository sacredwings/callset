// @ts-nocheck
'use client'
import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {openModal} from "@/lib/redux/slices/peer";
import {CallStart} from "@/lib/services/peer";

export default function UserId ({id}) {
    const myUser = useAppSelector((state) => state.myUser)
    const dispatch = useAppDispatch()

    console.log()

    const OnClick = () => {

        CallStart ({
            receiverId: id,
            isInitiator: true,
            video: true,
            audio: true
        })

/*
        dispatch(openModal({
            receiverId: id,
            isInitiator: true
        }))*/
    }

    return (
        <div >
            Пользователь {id}
            <button onClick={OnClick}>Позвонить</button>
        </div>
    )
}