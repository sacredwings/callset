// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/store/hooks";
import Style from "./list.module.sass";

export default function ChatsList ({}) {
    const myUser = useAppSelector((state) => state.myUser)

    return (
        <div className={Style.list}>
            Чаты
        </div>
    )
}