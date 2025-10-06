// @ts-nocheck
'use client'
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import Style from "./modal.module.sass";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {loadReCaptcha} from "recaptcha-v3-react-function-async"
import config from "../../../config.json";
import {ServerAccountGet} from "@/components/functions/urlApi";
import {openModal, closeModal} from "@/lib/redux/slices/peer";
import {setLocalStream, initializePeer, Signal, GetOffer, getRemoteStream} from "@/lib/services/peer";

export default function MenuList ({}) {
    const myUser = useAppSelector((state) => state.myUser)
    const peer = useAppSelector((state) => state.peer)
    const dispatch = useAppDispatch()

    const peerRef = useRef(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [isConnectedToPeer, setIsConnectedToPeer] = useState(false);

    const [peerStatus, setPeerStatus] = useState('Disconnected');

    useEffect(() => {
        (async () => {
            await setLocalStream(localVideoRef.current)
            //remoteVideoRef.current.srcObject = await getRemoteStream()

            await initializePeer({
                isInitiator: peer.isInitiator,
                receiverId: peer.receiverId//'68ca2abb2b651514545471ea'
            })
        })()
    }, [])

    useEffect(() => {
        (async () => {
            console.log('Устанавливаю remoteVideoRef')
            remoteVideoRef.current.srcObject = await getRemoteStream()
            //console.log(remoteVideoRef.current.srcObject)
        })()
    }, [peer.remoteStream])

    const  OnCloseModal = () => {
        dispatch(closeModal())
    }


    // --- Handler для кнопки "Start Call" ---
    const handleStartCall = async () => {
        Signal(GetOffer())

        /*
        // Получаем локальный поток, если его еще нет
        if (!localVideoRef.current?.srcObject) {
            const stream = await getLocalStream();
            if (!stream) {
                // Ошибка уже была показана в getLocalStream
                return;
            }
            // После получения потока, можем продолжить
        }

        // Если peer уже существует, ничего не делаем
        if (peerRef.current) {
            console.log('Peer connection already exists.');
            return;
        }

        console.log('Initiating call...');
        setPeerStatus('Initiating call...');
        // Создаем peer как инициатор
        createPeerConnection(socketRef.current, null, toId, true);
        */

    };

    return (
        <div>
            <h1>My Video Call Page</h1>
            {/*isConnectedToSocket ? <p>Соединен (socket id: <b>{socketRef.current.id}</b>)</p> : <p>Нет соединения</p>*/}
            <br/>

            <br/>
            <br/>



            <hr/>
            <p>Статус звонка <b>{peerStatus}</b></p>
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
            <button onClick={handleStartCall}>Принять вызов</button>

        </div>
    )
}