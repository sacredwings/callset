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

                <h1>Как пользоваться средством связи</h1>

                <video controls>
                    <source src="https://voenset.ru/file/app/Как пользоваться Nkvd.su.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}
