import MessagesMenu from "@/components/messages/menu";
import MessagesList from "@/components/messages/list";
import UsersId from "@/components/users/id";

export default async function Page ({
    params
}: {
    params: Promise<{ userId: string }>
}) {
    const {userId: userIdParam} = await params

    return (
        <div>
            <UsersId id={userIdParam}/>
        </div>
    );
}
