// @ts-nocheck
'use client'
import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {openModal} from "@/lib/redux/slices/peer";
import {CallStart} from "@/lib/services/peer";
import Style from "./id.module.sass";

export default function UserId ({user}) {
    const myUser = useAppSelector((state) => state.myUser)
    const dispatch = useAppDispatch()

    const OnClick = () => {

        CallStart ({
            receiverId: user._id,
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
        <div className={Style.component}>
            <h1>{user.login}</h1>
            <br/>
            <button onClick={OnClick}>Позвонить</button>
        </div>
    )
}