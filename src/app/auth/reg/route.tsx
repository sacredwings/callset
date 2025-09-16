// @ts-nocheck
import type { Metadata } from 'next'
import Reg from '@/components/auth/reg'

export default async function RegPage () {
    return (
        <main>
            <Reg />
        </main>
    )
}

export async function generateMetadata(): Promise<Metadata> {
    return { title: 'Регистрация' }
}