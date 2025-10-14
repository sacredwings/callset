import Link from 'next/link'
import Style from "./style.module.sass";

export default function Home() {
    return (
        <div>
            Мессенджер

            <br/>
            <Link href={'/users'}>Пользователи</Link>
            <br/>
            <Link href={'/chats'}>Чаты с пользователями</Link>
            <hr/>
            <Link href={'/auth/login'}>Авторизация</Link>
            <br/>
            <Link href={'/auth/reg'}>Регистрация</Link>
        </div>
    );
}
