// @ts-nocheck
import type { Metadata } from 'next'
import Reg from '@/components/auth/reg'
import Style from "@/app/auth/login/style.module.sass";
import AuthLogin from "@/components/auth/login";

export default async function RegPage () {
    return (
        <main className={Style.page}>
            <div className={Style.block}>
                <h1>Регистрация</h1>
                <div className={Style.center}>
                    <div className={Style.form}>
                        <Reg />
                    </div>
                </div>
            </div>
        </main>
    )
}

export async function generateMetadata(): Promise<Metadata> {
    return { title: 'Регистрация' }
}