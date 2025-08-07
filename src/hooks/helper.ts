import { verifytoken } from "@/services/jwt";
import db from "@/services/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getUserFromCookies(){
    const userCookies = await cookies();
    const token  = userCookies.get('token')?.value;

    if(!token)return null;
    const data = verifytoken(token);
    if(!data) return null;
    const user = await db.user.findUnique({
        where:{
            id: data.id
        },
        omit:{
            password: true
        },
        include:{
            company: true
        }
    });
    if(!user)return null;
    return user;
}

export function sendCustomResponse(success:boolean, data:any){
    return NextResponse.json({
        success,
        data
    })
}