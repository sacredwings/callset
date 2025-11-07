// @ts-nocheck
'use client'
import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {CallConnecting} from "@/lib/services/peer";
import Style from "./id.module.sass";

export default function UserId ({user, account}) {
    const myUser = useAppSelector((state) => state.myUser)
    const dispatch = useAppDispatch()

    const OnClickAudio = async () => {

        await CallConnecting ({
            receiverId: user._id,
            video: false,
            audio: true
        })

    }

    const OnClickVideo = async () => {

        await CallConnecting ({
            receiverId: user._id,
            video: true,
            audio: true
        })

    }

    return (
        <div className={Style.component}>
            <div className={Style.block}>
                <h1>{user.login}</h1>
                <br/>
                {account && account._id !== user._id ?
                    <button className="btn btn-dark" onClick={OnClickAudio}>
                        <i className="fa-solid fa-phone"></i>
                    </button> : null}
                {account && account._id !== user._id ? <button className="btn btn-dark" onClick={OnClickVideo}>
                    <i className="fa-solid fa-video"></i>
                </button> : null}
            </div>
        </div>
    )
}