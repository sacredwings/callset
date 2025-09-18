// @ts-nocheck
import { NextResponse } from 'next/server'
import { mongo, minio } from "@/lib/connect"
import Joi from "joi"
import { CAuth }  from "@/classes/auth"
import { CUser }  from "@/classes/user"
import {headers} from "next/headers";
import {serverCheckResult} from "recaptcha-v3-react-function-async";

export async function POST (request: Request) {
    try {
        //заголовки
        const headersList = headers()
        const userAgent = headersList.get('user-agent')

        let rsRequest = await request.json()

        try {
            //схема
            const schema = Joi.object({
                login: Joi.string().min(5).max(32).required(),
                password: Joi.string().min(8).max(32).required(),

                gtoken: Joi.string().required()
            })
            rsRequest = await schema.validateAsync(rsRequest)

        } catch (err) {
            console.log(err)
            throw ({...{code: 412, msg: 'Неверные параметры'}, ...err})
        }

        //if (!await serverCheckResult(rsRequest.gtoken, config.google.reCaptcha.secret)) throw ({code: 910, msg: 'Проверка reCaptcha'})

        try {
            await mongo()

            if (await CUser.GetByField({login: rsRequest.login})) throw ({code: 1000002, msg: 'Пользователь с указанным login уже зарегистрирован'})
        } catch (err) {
            throw (err)
        }

        try {
            //список
            let arFields = {
                login: rsRequest.login,
                password: rsRequest.password,
            }
            let arUser = await CUser.Add ( arFields )

            arFields = {
                login: rsRequest.login,
                password: rsRequest.password,
                ip: null,
                device: userAgent
            }
            let result = await CAuth.LoginByField ( arFields )

            return NextResponse.json({
                err: 0,
                response: result
            })
        } catch (err) {
            throw ({...{code: 1000000, msg: 'Ошибка регистрации'}, ...err})
        }

    } catch (err) {
        return NextResponse.json(err)
    }
}
