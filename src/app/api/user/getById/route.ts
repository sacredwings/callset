// @ts-nocheck
import { NextResponse } from 'next/server'
import { mongo, minio } from "@/lib/connect"
import { CUser }  from "@/classes/user"
import Joi  from "joi"
import {Authentication} from "@/app/api/function";

export async function GET(request: Request) {
    let url = {
        ids: request.nextUrl.searchParams.get('ids[]') as string,
    }
    if (url.ids) url.ids = url.ids.split(',')

    let value
    try {
        try {

            //схема
            const schema = Joi.object({
                ids: Joi.array().min(1).max(50).items(Joi.string().min(24).max(24)).required()
            })
            value = await schema.validateAsync(url)

        } catch (err) {
            console.log(err)
            throw ({code: 412, msg: 'Неверные параметры'})
        }

        try {
            await mongo()
            let userId = await Authentication(request)

            let result = await CUser.GetById ( value.ids )

            return NextResponse.json({
                code: 0,
                response: result
            })
        } catch (err) {
            console.log(err)
            throw ({...{code: 100000, msg: 'Ошибка в коде'}, ...err})
        }

    } catch (err) {
        console.log(err)
        return NextResponse.json(err)
    }
}
