// @ts-nocheck
import { CAuth }  from "@/classes/auth"
import { CUser }  from "@/classes/user"
import { cookies } from 'next/headers'

export async function Authentication (request) {
    //получение пользователя из авторизации

    const cookieStore = await cookies()
    const tid = cookieStore.get('tid')
    const tkey = cookieStore.get('tkey')

    if ((!tid) || (!tkey)) return false

    let auth = {
        tid: tid.value,
        tkey: tkey.value
    }

    let userId = await CAuth.TokenGetByIdKey(auth)
    if (!userId) return false

    let arFields = {
        last_action_date: new Date(),
    }
    await CUser.Edit(userId, arFields)

    return userId

}

export function formDataToObject(formData) {
    const object = {};

    formData.forEach((value, key) => {
        // 2) Assign each key-value pair to the object
        object[key] = value;
    });

    return object;
}
