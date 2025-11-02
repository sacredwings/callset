// @ts-nocheck
'use client'

import Link from 'next/link'
import Style from "./style.module.sass"
import {useEffect, useState} from "react"
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import {AuthUpdate} from "@/lib/redux/slices/myUser";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import cookie from "@/lib/cookie"; // Ваш сервис сокета
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

            //если аккаунта нет, не делаем полключений
            if (!account)
                return

            dispatch(AuthUpdate({
                auth: true,
                _id: account._id,
                login: account.login,
            }))

            await initializeSocket({
                tid: cookie.get('tid'),
                tkey: cookie.get('tkey')
            })

            await connectSocket()
        })()
    }, [])

    return (
        account ? <div className={Style.footerAuth}>
            <Link href={`/users/${account._id}`} className="btn btn-dark">
                <i className="fa-regular fa-circle-user"></i>
                <br/>
                {account.login}
            </Link>
            <Link href={'/users'} className="btn btn-dark">
                <i className="fa-solid fa-users"></i>
                <br/>
                пользователи
            </Link>
            <Link href={'/chats'} className="btn btn-dark">
                <i className="fa-solid fa-comment"></i>
                <br/>
                чаты
            </Link>
            <Link href={'/calls'} className="btn btn-dark">
                <i className="fa-solid fa-phone"></i>
                <br/>
                звонки
            </Link>
        </div> : <div className={Style.footerNoAuth}>
            <Link href={`/auth/login`} className="btn btn-dark">
                <i className="fa-regular fa-circle-user"></i>
                <br/>
                вход
            </Link>
            <Link href={'/auth/reg'} className="btn btn-dark">
                <i className="fa-solid fa-users"></i>
                <br/>
                регистрация
            </Link>
        </div>

    )
}