// @ts-nocheck
'use client'

import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {useRef, useEffect, useState} from "react"

export default function ToastList (props) {
    const toastSystem = useAppSelector((state) => state.toastSystem)
    const dispatch = useAppDispatch()

    const style = {
        display: 'block'
    }

    useEffect (() => {

    }, [])

    const List = () => {
        return toastSystem.map((item, i)=>{
            let msg = `Успешно`
            let type = `success`

            if (item.code) {
                msg = `${item.code} | ${item.msg}`
                type = `danger`
            }

            return <div key={i} className={`toast align-items-center text-white show bg-${type}`} role="alert" aria-live="assertive" aria-atomic="true" style={style}>
                <div className="d-flex">
                    <div className="toast-body">
                        {msg}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={()=>ToastSystemDel(item.id)}></button>
                </div>
            </div>
        })
    }

    return (
        <>
            <div className="toast-container position-fixed top-0 end-0 p-3">
                {List()}
            </div>
        </>
    )

}