// @ts-nocheck
import type { Metadata } from 'next'
import AuthLogin from '@/components/auth/login'

export default async function LoginPage () {
    return (
        <main>
            <AuthLogin />
        </main>
    )
}

export async function generateMetadata(): Promise<Metadata> {
    return { title: 'Вход' }
}