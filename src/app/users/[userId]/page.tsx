import MessagesMenu from "@/components/messages/menu";
import MessagesList from "@/components/messages/list";

export default async function Page ({
    params
}: {
    params: Promise<{ userId: string }>
}) {
    const {userId: userIdParam} = await params

    return (
        <div>
            Пользователь {userIdParam}
        </div>
    );
}
