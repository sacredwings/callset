// @ts-nocheck
'use client'
import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {openModal} from "@/lib/redux/slices/peer";
import {CallStart} from "@/lib/services/peer";
import Style from "./id.module.sass";

export default function UserId ({user, account}) {
    const myUser = useAppSelector((state) => state.myUser)
    const dispatch = useAppDispatch()

    const OnClick = () => {

        CallStart ({
            receiverId: user._id,
            isInitiator: true,
            video: true,
            audio: true
        })

    }

    return (
        <div className={Style.component}>
            <div className={Style.block}>
                <h1>{user.login}</h1>
                <br/>
                {account && account._id !== user._id ? <button className="btn btn-dark" onClick={OnClick}>Позвонить</button> : null}
            </div>
        </div>
    )
}