// @ts-nocheck
import UsersList from "@/components/users/list"
import {cookies} from "next/headers";
import {ServerUserGet} from "@/components/functions/urlApi";
import Form from "@/components/menu/form";

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
        <div>
            <Form searchParams={await searchParams} url={queryUrl} count={list.count}/>
            <UsersList list={list}/>
        </div>
    );
}
