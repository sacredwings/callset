import Link from 'next/link'
import Style from "./style.module.sass";
import AuthLogin from '@/components/auth/login'
import {ServerAccountGet} from "@/components/functions/urlApi";
import {cookies} from "next/headers";

export default async function Home() {
    const account = await ServerAccountGet({cookies: await cookies()})

    return (
        <div className={Style.page}>
            <div className={Style.block}>
                <h1>Мессенджер</h1>

                <div className={Style.button}>
                    {account ? <>
                        <Link href={`/users/${account._id}`} className="btn btn-dark">
                            <i className="fa-regular fa-circle-user"></i>
                            <br/>
                            {account.login}
                        </Link>
                        <Link href={'/users'} className="btn btn-dark">
                            <i className="fa-solid fa-users"></i>
                            <br/>
                            пользователи
                        </Link>
                    </> : <>
                        <Link href={'/auth/login'} className="btn btn-dark">Вход</Link>
                        <Link href={'/auth/reg'} className="btn btn-dark">Регистрация</Link>

                    </>}

                </div>
            </div>
        </div>
    );
}
