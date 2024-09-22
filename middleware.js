import { NextResponse } from "next/server";

export function middleware(request)
{
    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/credentials";

    const cookie = request.cookies.get("tokenJWT")?.value || '';

    if(cookie && isPublicPath)
    {
        return NextResponse.redirect("http://localhost:3000/");
    }

    if(!isPublicPath && !cookie)
    {
        return NextResponse.redirect("http://localhost:3000/credentials")
    }
}

export const config = {
    matcher:[
        "/",
        "/settings",
        "/chat",
        "/chat/:chatid",
        "/calls",
        "/groupchat",
        "/groupchat/:groupid"
    ]
}