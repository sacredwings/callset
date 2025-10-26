// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/redux/hooks";
import Style from "./menu.module.sass";

export default function MenuChat ({userId}) {
    //const myUser = useAppSelector((state) => state.myUser)

    return (
        <div className={Style.menu}>
            Пользователь {userId}
        </div>
    )
}