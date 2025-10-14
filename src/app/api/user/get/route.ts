// @ts-nocheck
import { NextResponse } from 'next/server'
import { mongo, minio } from "@/lib/connect"
import { CUser }  from "@/classes/user"
import Joi from "joi";
import {Authentication} from "@/app/api/function";

export async function GET(request: Request) {
    let value
    try {

        try {
            let url = {
                q: request.nextUrl.searchParams.get('q') as string,

                offset: request.nextUrl.searchParams.get('offset') as string,
                count: request.nextUrl.searchParams.get('count') as string
            }

            //схема
            const schema = Joi.object({
                q: Joi.string().min(3).max(255).empty(null).default(null),

                offset: Joi.number().integer().min(0).max(9223372036854775807).empty(['', null]).default(0),
                count: Joi.number().integer().min(0).max(2000).empty(['', null]).default(20),
            })
            value = await schema.validateAsync(url)
        } catch (err) {
            console.log(err)
            throw ({code: 412, msg: 'Неверные параметры'})
        }

        try {
            await mongo()
            await Authentication(request)

            let arFields = {
                q: value.q,

                offset: value.offset,
                count: value.count
            }

            let items = await CUser.Get ( arFields )
            let count = await CUser.GetCount ( arFields )

            return NextResponse.json({
                code: 0,
                response: {
                    count: count,
                    items: items
                }
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

export const dynamic = 'force-dynamic';
