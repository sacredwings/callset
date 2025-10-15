// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/redux/hooks"
import Style from "./list.module.sass"
import Element from "./element"

export default function UsersList ({list}) {
    const myUser = useAppSelector((state) => state.myUser)

    return (
        <div className={Style.list}>
            {list.items.map((item, i) => {
                return <Element key={i} element={item}/>
            })}
        </div>
    )
}