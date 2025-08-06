import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}:{
    params:Promise<{
        id: string
    }>
}){
    const pr = await params;
    const job_id = pr.id;

    try{
        const res = await db.application.findMany({
            where: {
                job_id: job_id,
            },
            include:{
                user: true,
            }
        });

        if(!res){
            return NextResponse.json({
                success: false,
                message: "No response!",
            })
        }
        return NextResponse.json({
            success: true,
            data: res
        })
    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!",
        })
    }
}