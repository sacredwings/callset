// @ts-nocheck
'use client'

import Link from "next/link"
import {useRouter} from "next/navigation";
import {useState} from 'react'
import {useAppSelector, useAppDispatch} from "@/lib/redux/hooks"
import {AuthSet} from "@/lib/redux/slices/myUser"
import {ServerAuthReg} from "@/components/functions/urlApi"

export default function AuthReg () {

    let [form, setForm] = useState({
        login: '',
        password: ''
    })
    let formErrDefault = {
        login: false,
        password: false,
    }
    let [formErr, setFormErr] = useState(formErrDefault)
    const dispatch = useAppDispatch()
    const router = useRouter() //для перехода к пользователю

    async function onClickReg (event) {
        event.preventDefault();

        //выходим ошибки формы
        if (form.login.length < 5)
            setFormErr(prevState => ({...prevState, login: true}))
        if (form.password.length < 8)
            setFormErr(prevState => ({...prevState, password: true}))

        //системная ошибка
        if ((form.login.length < 5) || (form.password.length < 8)) return


        let response = await ServerAuthReg({
            login: form.login,
            password: form.password,
        })

        //авторизация в сторе
        if (!response) return

        dispatch(AuthSet({
            _id: response._id,
            login: response.login,
            tokenId: response.tid,
            tokenKey: response.tkey,
            remember: true
        }))

        //await router.push(`/users/`)
        await router.push(`/users/${response._id}`)
    }

    function onChange (event) {
        const name = event.target.name
        let value = event.target.value

        //удаление пробелов
        if (name === 'login')
            value = value.replace(/\s/g, '');

        //выходим если длиньше 32
        if (event.target.value.length > 32) return

        //сбрасываем ошибки
        setFormErr(formErrDefault)

        setForm(prev => ({...prev, ...{[name]: value}}))
    }

    return <>
        <div className="shadow p-3 mb-3 bg-white rounded">
            <h2 className="">Регистрация</h2>

        </div>

        <div className="shadow p-3 mb-3 bg-white rounded">
            <form onSubmit={onClickReg}>
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">Логин</label>
                    <input type="text" className={`form-control ${formErr.login ? `is-invalid`:null}`} id="login" name="login" minLength={5} maxLength={32} value={form.login} onChange={onChange} autoComplete=""/>
                    <div id="validationServer03Feedback" style={formErr.login ? {display: 'block'} : null} className={`invalid-feedback`}>
                        Введите более 5 символов
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Придумайте пароль</label>
                    <input type="password" className={`form-control ${formErr.password ? `is-invalid`:null}`} id="password" name="password" minLength={8} maxLength={32} value={form.password} onChange={onChange} autoComplete=""/>
                    <div id="validationServer03Feedback" style={formErr.password ? {display: 'block'} : null} className={`invalid-feedback`}>
                        Введите более 8 символов
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
            </form>
        </div>
    </>
}