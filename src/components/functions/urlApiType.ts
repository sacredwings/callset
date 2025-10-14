//----------------------------------------------------------------------------------------------------------------------
//АВТОРИЗАЦИЯ
export interface interfaceAuthLogin {
    login: string
    password: string

    gtoken?: string
}
export interface interfaceAuthReg {
    login: string
    password: string

    gtoken?: string
}

//
//----------------------------------------------------------------------------------------------------------------------
//ПОЛЬЗОВАТЕЛЬ
export interface interfaceUserGet {
    q: string | null

    offset: number
    count: number
}
export interface interfaceUserGetById {
    ids: string[]
}