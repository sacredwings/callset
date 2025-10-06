// @ts-nocheck
'use client'
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import Style from "./modal.module.sass";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import config from "../../../config.json";
import {ServerAccountGet} from "@/components/functions/urlApi";
import {openModal, closeModal} from "@/lib/redux/slices/peer";
import {getLocalStream} from "@/lib/services/peer";
import Call from "@/components/call/call";

export default function MenuList ({}) {
    const myUser = useAppSelector((state) => state.myUser)
    const peer = useAppSelector((state) => state.peer)
    const dispatch = useAppDispatch()

    useEffect(() => {
        (async () => {

        })()
    }, [peer.isModalOpen])

    const  OnCloseModal = () => {
        dispatch(closeModal())
    }

    return (
        <div className={Style.modal} style={peer.isModalOpen ? {display: 'block'} : {display: 'none'}}>
            <div className={Style.template}>
                Окно вызова
                <br />
                <button onClick={OnCloseModal}>Отмена вызова</button>
                <br />
                <button>Взять трубку</button>

                {peer.isModalOpen ? <Call /> : null}
            </div>
        </div>
    )
}