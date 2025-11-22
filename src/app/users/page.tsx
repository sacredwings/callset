// @ts-nocheck
import UsersList from "@/components/users/list"
import {cookies} from "next/headers";
import {ServerUserGet} from "@/components/functions/urlApi";
import Form from "@/components/menu/form";
import Style from "./style.module.sass"

export const metadata: Metadata = {
    title: 'Пользователи',
    description: '',
}

export default async function Page ({
    searchParams
}: {
    searchParams: Promise<{ page: number, q: string }>
}) {
    const {page: pageSearchParam, q: qSearchParam} = await searchParams
    const cookieStore = await cookies()

    const queryUrl = `/users`
    const queryCount = 20
    const queryOffset = pageSearchParam ? (Number(pageSearchParam) - 1) * queryCount : 0

    const list = await ServerUserGet({
        q: qSearchParam ?? null,

        count: queryCount,
        offset: queryOffset
    }, {cookies: cookieStore})

    return (
        <div className={Style.page}>
            <div className={Style.content}>
                <h1>Пользователи</h1>
                <Form searchParams={await searchParams} url={queryUrl} count={list.count}/>
                <UsersList list={list}/>
            </div>
        </div>
    );
}
