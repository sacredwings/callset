// @ts-nocheck
import Link from 'next/link'
import Style from "./style.module.sass";
import {ServerAccountGet} from "@/components/functions/urlApi";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: 'Средство связи (коммуникатор) nkvd.su',
    description: 'Сайт, форум, видео, статьи, фото, документы, чаты, приложение для Военных',
}

export default async function Home() {
    const account = await ServerAccountGet({cookies: await cookies()})

    return (
        <div className={Style.page}>
            <div className={Style.block}>
                <img src={'/nkvd.su.png'} style={{height: '200px'}}/>

                <h1>Средство связи (коммуникатор)</h1>
                <a href="https://voenset.ru/file/app/nkvd.su.apk" className="btn btn-success btn-sm" download>
                    Скачать .apk (андроид версия)
                </a>
                <p><span className="badge text-bg-dark">nkvd.su</span></p>

                <Link href={'/lesson'}>Как пользоваться средством связи</Link>

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
