// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/redux/hooks";
import Style from "./chats.module.sass";

export default function ChatsList ({}) {
    const myUser = useAppSelector((state) => state.myUser)

    return (
        <div className={Style.list}>
            Чаты
        </div>
    )
}