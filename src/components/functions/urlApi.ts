// @ts-nocheck
//АККАУНТ
import {
    interfaceAuthLogin,
    interfaceAuthReg,
    interfaceUserGet,
    interfaceUserGetById
} from "@/components/functions/urlApiType";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import config from "../../../config.json";
import axios, {AxiosRequestConfig} from "axios"

export async function ServerAccountGet ({cookies=null}) {
    if (is_server()) axios.defaults.baseURL = `http://127.0.0.1:3000`

    let arFields = {
        headers: {
            Cookie: cookies
        }
    } as AxiosRequestConfig

    let url = `/api/account/get`
    console.log(url)
    let res = await axios.get(url, arFields)
    return res.data.response
}

//----------------------------------------------------------------------------------------------------------------------
//АВТОРИЗАЦИЯ
export async function ServerAuthLogin ({
    login,
    password,
}: interfaceAuthLogin){
    if (is_server()) axios.defaults.baseURL = `http://127.0.0.1:3000`
    let gtoken = await reCaptchaExecute(config.google.reCaptcha.public, `auth_login`)

    let arFields = {
        login,
        password,

        gtoken
    } as interfaceAuthLogin

    const url = `/api/auth/login`;
    console.log(url)
    let res = await axios.post(url, arFields)
    //await ToastSystemAdd(res.data)
    return res.data.response
}

export async function ServerAuthReg ({
    login,
    password,
}: interfaceAuthReg){
    if (is_server()) axios.defaults.baseURL = `http://127.0.0.1:3000`
    let gtoken = await reCaptchaExecute(config.google.reCaptcha.public, `auth_reg`)

    let arFields = {
        login,
        password,

        gtoken
    } as interfaceAuthReg

    const url = `/api/auth/reg`;
    console.log(url)
    let res = await axios.post(url, arFields)
    //await ToastSystemAdd(res.data)
    return res.data.response
}

//----------------------------------------------------------------------------------------------------------------------
//ПОЛЬЗОВАТЕЛЬ
export async function ServerUserGet ({
    q=null,

    offset=0,
    count=20
}: interfaceUserGet, {
    cookies=null
}) {
    if (is_server()) axios.defaults.baseURL = `http://127.0.0.1:3000`

    let arFields = {
        params: {
            q,

            offset,
            count
        } as interfaceUserGet,
        headers: {
            Cookie: cookies
        }
    } as AxiosRequestConfig

    let url = `/api/user/get`
    console.log(url)
    let res = await axios.get(url, arFields);
    return res.data.response
}
export async function ServerUserGetById ({
    ids
}: interfaceUserGetById, {
    cookies=null
}) {
    if (is_server()) axios.defaults.baseURL = `http://127.0.0.1:3000`

    let arFields = {
        params: {
            ids,
        } as interfaceUserGetById,
        headers: {
            Cookie: cookies
        }
    } as AxiosRequestConfig

    let url = `/api/user/getById`
    console.log(url)
    let res = await axios.get(url, arFields);
    return res.data.response
}




//проверка где ввыполняется запрос
function is_server () {
    return ! (typeof window != 'undefined' && window.document);
}