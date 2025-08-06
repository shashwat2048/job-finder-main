//@ts-nocheck
import { getUserFromCookies } from "@/hooks/helper";
import { setAuthCookies } from "@/services/cookies";
import { createToken } from "@/services/jwt";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json();

    try{
        const user = await db.user.findUnique({
            where:{
                email: body.email,
            }
        });
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found!"
            })
        }
        if(user?.password===body?.password){
            const token = await createToken(user);
            const res = NextResponse.json({
                success: true,
                user: user
            })
            res.cookies.set('token', token);
            return res;
        }
    }catch(error){
        console.error(error);
    }
    return NextResponse.json({
        success: false,
        message:'Invalid credentials'
    })
}