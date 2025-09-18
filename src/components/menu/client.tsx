// @ts-nocheck
'use client'

import Link from 'next/link'
import Style from "./style.module.sass"
import {useEffect, useState} from "react"

export default function MenuClient ({account}) {
    useEffect(() => {
        (async () => {
            console.log(account)
        })()
    }, [])

    return (
        <div className={Style.menu}>
            <Link href={`/users/${account._id}`}>{account.login}</Link>
            <Link href={'/users'}>пользователи</Link>
            <Link href={'/chats'}>чаты</Link>
            <Link href={'/calls'}>звонки</Link>
        </div>
    )
}