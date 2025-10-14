// @ts-nocheck
'use client'
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import Style from "./modal.module.sass";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import config from "../../../config.json";
import {ServerAccountGet} from "@/components/functions/urlApi";
import {openModal, closeModal} from "@/lib/redux/slices/peer";
import {CallEnd, getLocalStream, GetOffer, getRemoteStream, setLocalStream, Signal, state} from "@/lib/services/peer";
import Call from "@/components/call/call";


export default function MenuList ({}) {
    const myUser = useAppSelector((state) => state.myUser)
    const peer = useAppSelector((state) => state.peer)
    const dispatch = useAppDispatch()

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (peer.localStream) {
                localVideoRef.current.srcObject = await getLocalStream()
            }
        })()
    }, [peer.localStream])


    useEffect(() => {
        (async () => {
            if (peer.remoteStream) {
                remoteVideoRef.current.srcObject = await getRemoteStream()
            }
        })()
    }, [peer.remoteStream])

    const  OnCloseModal = () => {
        CallEnd()
    }

    // --- Handler для кнопки "Start Call" ---
    const handleStartCall = async () => {
        Signal(GetOffer())

    }

    return (
        <div className={Style.modal} style={peer.isModalOpen ? {display: 'block'} : {display: 'none'}}>
            <div className={Style.template}>

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    //muted
                    //style={{ width: '250px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
                    className={Style.remoteVideo}
                />

                <div className={Style.contentOverlay}>



                    <div className={Style.content}>
                        <div className={Style.name}>
                            <p>User name</p>
                        </div>

                        <div className={Style.footer}>
                            <div className={Style.localVideo}>
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    //muted
                                    //className={Style.localVideo}
                                    //style={{ width: '250px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
                                />
                            </div>
                            <div className={Style.button}>
                                <button onClick={OnCloseModal}>Отмена вызова</button>
                                {peer.isInitiator === false ? <button onClick={handleStartCall}>Принять вызов</button> : null}
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