import ChatsMenu from "@/components/chats/menu"
import UsersList from "@/components/users/list"
import {cookies} from "next/headers";
import {ServerUserGet} from "@/components/functions/urlApi";

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

    const arUsers = await ServerUserGet({
        q: qSearchParam ?? null,

        count: queryCount,
        offset: queryOffset
    }, {cookies: cookieStore})

    return (
        <div>
            <ChatsMenu />
            <UsersList list={arUsers}/>
        </div>
    );
}
