// @ts-nocheck
import Style from "./element.module.sass";
import React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function SearchElement ({element}) {
    const router = useRouter()

    const OnClick = async () => {
        await router.push(`/users/${element._id}`)
    }

    return (
        <div className={Style.element}>
            <span onClick={OnClick}>{element.login}</span>
        </div>
    )
}
