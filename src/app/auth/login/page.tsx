// @ts-nocheck
import type { Metadata } from 'next'
import AuthLogin from '@/components/auth/login'
import Style from "./style.module.sass";
import Link from "next/link";

export default async function LoginPage () {
    return (
        <main className={Style.page}>
            <div className={Style.block}>
                <h1>Вход</h1>
                <div className={Style.center}>
                    <div className={Style.form}>
                        <AuthLogin />
                    </div>
                </div>
            </div>
        </main>
    )
}

export async function generateMetadata(): Promise<Metadata> {
    return { title: 'Вход' }
}