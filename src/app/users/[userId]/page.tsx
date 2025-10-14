import MessagesMenu from "@/components/messages/menu";
import MessagesList from "@/components/messages/list";
import UsersId from "@/components/users/id";
import {ServerUserGetById} from "@/components/functions/urlApi";
import {cookies} from "next/headers";

export default async function Page ({
    params
}: {
    params: Promise<{ userId: string }>
}) {
    const {userId: userIdParam} = await params
    const cookieStore = await cookies()

    const user = await ServerUserGetById({
        ids: [userIdParam]
    }, {cookies: cookieStore})

    console.log(user)

    return (
        <div>
            <UsersId user={user[0]}/>
        </div>
    );
}
