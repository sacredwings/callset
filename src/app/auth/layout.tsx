// @ts-nocheck

export default function Layout({
                                   children
                               }: {
    children: React.ReactNode
}) {
    return (
        <main className={'container'} style={{maxWidth: '540px'}}>
            {children}
        </main>
    )
}
