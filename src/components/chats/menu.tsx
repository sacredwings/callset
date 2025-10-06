// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/redux/hooks";
import Style from "./chats.module.sass";
import {useEffect, useState} from "react";
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import config from "../../../config.json";
import {ServerAccountGet} from "@/components/functions/urlApi";

export default function MenuList ({}) {
    const myUser = useAppSelector((state) => state.myUser)

    useEffect(() => {
        (async () => {
            const resAccount = await ServerAccountGet({})

            console.log(resAccount)
            //LogIn(resAccount)
        })()
    }, [myUser])
    //

    const LogIn = (account) => {
        if (!account) return
        dispatch(AuthUpdate({
            _id: account._id,
            login: account.login,

            message: account.message,
            friend: account.friend,
            notify: account.notify,
            visitor: account.visitor,
        }))
    }

    const LogOut = () => {
        dispatch(AuthDel())
    }

    return (
        <div className={Style.menu}>
            <button>=</button>

            <input type={'text'}/>
        </div>
    )
}