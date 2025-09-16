// @ts-nocheck
'use client'

import {useRouter} from "next/navigation";
import {useState} from 'react'
import axios from 'axios'
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"

//store
import {useAppSelector, useAppDispatch} from "@/store/hooks"
import {AuthSet} from "@/store/reducer/myUser"

import config from '../../../config.json'
import {ServerAuthReg} from "@/component/function/url_api";

//https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=%D0%9B%D0%9E%D0%93%D0%98%D0%9D&password=%D0%9F%D0%90%D0%A0%D0%9E%D0%9B%D0%AC&captcha_key=q24yud&captcha_sid=656412648896

export default function Reg () {
    let [form, setForm] = useState({
        email: '',
        login: '',
        password: ''
    })
    let formErrDefault = {
        email: false,
        login: false,
        password: false,
    }
    let [formErr, setFormErr] = useState(formErrDefault)
    const dispatch = useAppDispatch()
    const router = useRouter() //для перехода к пользователю

    async function onClickReg (event) {
        event.preventDefault();

        //выходим ошибки формы
        if (form.email.length < 5)
            setFormErr(prevState => ({...prevState, email: true}))
        if (form.login.length < 5)
            setFormErr(prevState => ({...prevState, login: true}))
        if (form.password.length < 8)
            setFormErr(prevState => ({...prevState, password: true}))

        //системная ошибка
        if ((form.email.length < 5) || (form.login.length < 5) || (form.password.length < 8)) return

        let gtoken = await reCaptchaExecute(config.google.reCaptcha.public, 'reg')

        let response = await ServerAuthReg({
            email: form.email,
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

        await router.push(`/user/${response._id}`)
    }

    function onChange (event) {
        const name = event.target.name
        let value = event.target.value

        //удаление пробелов
        if ((name === 'email') || (name === 'login'))
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

            {/*<video controls={true} preload="preload" style={{width: '100%'}}>
                <source src="https://voenset.ru/files/f1/97/f197b1a41bd0b659d5db8f73c5badd64.mp4"
                        type="video/mp4"/>
            </video>*/}
        </div>

        <div className="shadow p-3 mb-3 bg-white rounded">
            <form onSubmit={onClickReg}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className={`form-control ${formErr.email ? `is-invalid`:null}`} id="email" name="email" minLength={5} maxLength={32} value={form.email} onChange={onChange} autoComplete=""/>
                    <div id="validationServer03Feedback" style={formErr.email ? {display: 'block'} : null} className={`invalid-feedback`}>
                        Введите более 5 символов
                    </div>
                </div>
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