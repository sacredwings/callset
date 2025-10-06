// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/redux/hooks"
import Style from "./list.module.sass"

export default function MessagesList ({userId}) {
    const myUser = useAppSelector((state) => state.myUser)

    return (
        <div className={Style.list}>
            Переписка с {userId}
        </div>
    )
}