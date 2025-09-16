import NavbarMessages from "@/components/navbar/messages";
import MessagesList from "@/components/messages/list";

export default async function Page ({
    params
}: {
    params: Promise<{ userId: string }>
}) {
    const {userId: userIdParam} = await params

    return (
        <div>
            <NavbarMessages userId={userIdParam}/>
            <MessagesList userId={userIdParam}/>
        </div>
    );
}
