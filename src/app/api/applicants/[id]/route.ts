import { getUserFromCookies, sendCustomResponse } from "@/hooks/helper";
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

export async function DELETE(req:NextRequest){
    try{
        const user = await getUserFromCookies();
        if(!user){
            return sendCustomResponse(false, "User not found");
        }
        
        const data = await req.json();
        const {id} = data;
        
        // Find the application with job and company details
        const application = await db.application.findUnique({
            where:{
                id,
            },
            include: {
                job: {
                    include: {
                        company: true
                    }
                },
                user: true
            }
        });

        if(!application){
            return sendCustomResponse(false, "Application not found");
        }

        const isApplicant = application.user_id === user.id;

        const isCompanyOwner = user.company && user.company.id === application.job.company_id;

        if(!isApplicant && !isCompanyOwner){
            return sendCustomResponse(false, "Unauthorized: Only the applicant or company owner can delete this application");
        }

        await db.application.delete({
            where: {
                id
            }
        });

        return sendCustomResponse(true, "Application deleted successfully");

    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!",
        })
    }
}