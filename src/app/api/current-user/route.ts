import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const user = await getUserFromCookies();
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found!",
            })
        }

        const userId = user.id;
        const company = await db.company.findUnique({
            where:{
                ownerId: userId,
            }
        });

        const data = {
            ...user,
            company
        }

        return NextResponse.json({
            success: true,
            data: data
        })

    }catch(error){
        console.error("Something went wrong!", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong!"
        })
    }
}