import Link from 'next/link'
import Style from "./style.module.sass";

export default function Home() {
    return (
        <div className={Style.template}>
            Мессенджер
            <br/>
            <Link href={'/users'}>Пользователи</Link>
            <br/>
            <Link href={'/chats'}>Чаты с пользователями</Link>
        </div>
    );
}
