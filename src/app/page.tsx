import Link from 'next/link'
import Style from "./style.module.sass";
import AuthLogin from '@/components/auth/login'

export default function Home() {
    return (
        <div className={Style.page}>
            <div className={Style.block}>
                <h1>Мессенджер</h1>

                <div className={Style.button}>
                    <Link href={'/auth/login'} className="btn btn-dark">Вход</Link>
                    <Link href={'/auth/reg'} className="btn btn-dark">Регистрация</Link>
                </div>
            </div>
        </div>
    );
}
