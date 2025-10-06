// @ts-nocheck
'use client'
import {useAppSelector} from "@/lib/redux/hooks";
import Style from "./chats.module.sass";
import {useEffect, useState} from "react";
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import config from "../../../config.json";

export default function MenuList ({}) {
    const myUser = useAppSelector((state) => state.myUser)

    useEffect(() => {
        (async () => {


        })()
    }, [])

    return (
        <>
        </>
    )
}