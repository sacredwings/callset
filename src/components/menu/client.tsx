// @ts-nocheck
'use client'

import Link from 'next/link'
import Style from "./style.module.sass"
import {useEffect, useState} from "react"
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import {AuthUpdate} from "@/lib/redux/slices/myUser";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import Socket from "@/lib/socket1";
//import {Connect, initializeSocket} from '@/services/socketService';
import cookie from "@/lib/cookie"; // Ваш сервис сокета
import CallModal from '@/components/call/modal';
import {initializeSocket, connectSocket} from "@/lib/services/socket";
import config from "../../../config.json";

export default function MenuClient ({account}) {
    const dispatch = useAppDispatch()

    useEffect(() => {
        (async () => {
            //установка reCaptcha
            loadReCaptcha(
                config.google.reCaptcha.public,
            )
                .then(() => {
                    console.log('ReCaptcha loaded')
                })
                .catch((e) => {
                    console.error('Error when load ReCaptcha', e)
                })

            dispatch(AuthUpdate({
                auth: true,
                _id: account._id,
                login: account.login,
            }))

            initializeSocket({
                    url: config.server.socket,
                    auth: {
                        tid: cookie.get('tid'),
                        tkey: cookie.get('tkey')
                    }
                }
            )
            connectSocket()
        })()
    }, [])

    return (
        <>
        {/*<Socket />*/}

            <div className={Style.menu}>
                <Link href={`/users/${account._id}`}>{account.login}</Link>
                <Link href={'/users'}>пользователи</Link>
                <Link href={'/chats'}>чаты</Link>
                <Link href={'/calls'}>звонки</Link>
            </div>
        </>

    )
}