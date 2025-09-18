// @ts-nocheck
import {cookies} from "next/headers";
import Client from "./client";
import {ServerAccountGet, ServerNotifyNoViewedCount} from "@/components/functions/urlApi";

export default async function MenuServer ({}) {
    const account = await ServerAccountGet({cookies: await cookies()})

    return (
        <Client account={account}/>
    )
}
