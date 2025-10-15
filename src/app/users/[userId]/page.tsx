import MessagesMenu from "@/components/messages/menu";
import MessagesList from "@/components/messages/list";
import UsersId from "@/components/users/id";
import {ServerAccountGet, ServerUserGetById} from "@/components/functions/urlApi";
import {cookies} from "next/headers";

export default async function Page ({
    params
}: {
    params: Promise<{ userId: string }>
}) {
    const {userId: userIdParam} = await params
    const cookieStore = await cookies()

    const account = await ServerAccountGet({cookies: await cookies()})
    const user = await ServerUserGetById({
        ids: [userIdParam]
    }, {cookies: cookieStore})

    return <UsersId user={user[0]} account={account}/>
}
