import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const user = await getUserFromCookies();
    const body = await req.json();

    console.log(body)

    // const dataToken = {
    //     ...body,
    //     company_id: user?.company?.id
    // }

    try{
        const data = await db.openings.create({
            data: body
        });
        return NextResponse.json({
            success: true,
            data: data,
        })
    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong!"
        })
    }
}