import { NextResponse } from "next/server";

export function middleware(request)
{
    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/credentials" || path === "/verifyemail";

    const cookie = request.cookies.get("tokenJWT")?.value || '';

    if(cookie && isPublicPath)
    {
        return NextResponse.redirect("/");
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