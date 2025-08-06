import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const user = await getUserFromCookies();
        if(!user){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            })
        }
        const body = await req.json();
        const company = {
            title: body.name,
            description: body.description,
            ownerId: user.id
        }
        const newCompany=  await db.company.create({
            data: company,
        })
        return NextResponse.json({
            success: true,
            data: newCompany
        })

    }catch(error){
        console.error(error);
        return NextResponse.json({
            success : false,
            message: `something went wrong: ${error}`
        })
    }
}
