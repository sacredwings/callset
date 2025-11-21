// @ts-nocheck
'use client'
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import Style from "./modal.module.sass";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    CallDisconnected,
    GetLocalStream,
    GetRemoteStream,
    CallConnected,
} from "@/lib/services/peer";
import {ServerUserGetById} from "@/components/functions/urlApi";

export default function MenuList ({}) {
    const myUser = useAppSelector((state) => state.myUser)
    const peer = useAppSelector((state) => state.peer)
    const dispatch = useAppDispatch()

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const audioInRef = useRef(null);
    const audioOutRef = useRef(null);

    let [receiverUser, setReceiverUser] = useState(null)
    let [answerCall, setAnswerCall] = useState(false)

    useEffect(() => {
        (async () => {
            if (!audioInRef.current || !audioOutRef.current)
                return

            if (peer.isConnecting) {
                if (peer.isInitiator === true) {
                    audioOutRef.current.play()
                } else if (peer.isInitiator === false) {
                    audioInRef.current.play()
                }
            } else {
                audioInRef.current.pause()
                audioInRef.current.currentTime = 0

                audioOutRef.current.pause()
                audioOutRef.current.currentTime = 0
            }

        })()
    }, [peer.isConnecting])

    useEffect(() => {
        (async () => {
            if (peer.localStream) {
                localVideoRef.current.srcObject = await GetLocalStream()
            }
        })()
    }, [peer.localStream])

    useEffect(() => {
        (async () => {
            if (peer.remoteStream) {
                remoteVideoRef.current.srcObject = await GetRemoteStream()
            }
        })()
    }, [peer.remoteStream])

    useEffect(() => {
        (async () => {
            if (!peer.receiverId) return

            const user = await ServerUserGetById({
                ids: [peer.receiverId]
            }, {})

            if (!user.length) return

            setReceiverUser(user[0])
        })()
    }, [peer.receiverId])

    // --- Handler для кнопки "Close Call" ---
    const  OnCloseModal = () => {
        setAnswerCall(false)
        CallDisconnected()

        //audioInRef.current.pause()
        //audioInRef.current.currentTime = 0

        //audioOutRef.current.pause()
        //audioOutRef.current.currentTime = 0
    }

    // --- Handler для кнопки "Start Call" ---
    const handleStartCall = async () => {
        setAnswerCall(true)
        await CallConnected()
    }

    return (
        <div className={Style.modal} style={peer.isModalOpen ? {display: 'block'} : {display: 'none'}}>
            <div className={Style.template}>

                <>
                    <audio ref={audioInRef} loop={true}>
                        <source src="/public/call/in.mp3" type="audio/mpeg" />
                        Ваш браузер не поддерживает аудио элемент.
                    </audio>
                    <audio ref={audioOutRef} loop={true}>
                        <source src="/public/call/out.mp3" type="audio/mpeg" />
                        Ваш браузер не поддерживает аудио элемент.
                    </audio>
                </>

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className={Style.remoteVideo}
                />

                <div className={Style.contentOverlay}>
                    <div className={Style.content}>
                        <div className={Style.name}>
                            <p>{receiverUser && receiverUser.login}</p>
                            <p>{peer.video ? 'Видео звонок' : 'Аудио звонок'}</p>
                        </div>

                        <div className={Style.footer}>
                            <div className={Style.button}>
                                {/* входящий и еще не взял трубку */}
                                {peer.isInitiator === false && !answerCall ? <button className={Style.open} onClick={handleStartCall}>
                                    <i className="fa-solid fa-phone-volume"></i>
                                </button> : null}

                                <button className={Style.close} onClick={OnCloseModal}>
                                    <i className="fa-solid fa-phone-slash"></i>
                                </button>
                            </div>

                            <div className={Style.localVideo}>
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/*
                <h1>Звонок</h1>


                <hr/>

                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3>Your Video</h3>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '250px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
                        />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h3>Remote Video</h3>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            style={{ width: '250px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#eee' }}
                        />
                    </div>
                </div>
                <br />
                <button onClick={OnCloseModal}>Отмена вызова</button>
                <br />
                {peer.isInitiator === false ? <button onClick={handleStartCall}>Принять вызов</button> : null}
 */