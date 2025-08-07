import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        const user = await getUserFromCookies();
        if(!user){
            return NextResponse.json({
                success:false,
                message:"User not found"
            })
        }
        const appliedJobs = await db.application.findMany({
            where:{
                user_id : user.id
            },
            include:{
                job:{
                    include:{
                        company:true
                    }
                }
            }
        });

        return NextResponse.json({
            success:true,
            data: appliedJobs
        })
    }catch(err){
        return NextResponse.json({
            success:false,
            message:`something went wrong : ${err}`
        })
    }
}