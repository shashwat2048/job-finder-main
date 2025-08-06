import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookies } from "@/hooks/helper";

export async function GET(req:NextRequest, {params}:{
    params:Promise<{
        id: string;
    }>
}){
    const pr = await params
    const id = pr.id;

    try{
        const job = await db.openings.findUnique({
            where:{
                id:id
            },
            include:{
                company: true,
            }
        }
        )
        if(job){
            return NextResponse.json({
                success: true,
                data: job,
            })
        }else{
            return NextResponse.json({
                success: false,
                message: "job not found ;-;"
            })
        }
    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong!"
        })
    }

}

export async function PUT(req: NextRequest, {params}:{
    params: Promise<{
        id: string
    }>
}){
    try {
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        const pr = await params;
        const jobId = pr.id;
        const body = await req.json();

        // Check if the job exists and belongs to user's company
        const existingJob = await db.openings.findUnique({
            where: { id: jobId },
            include: { company: true }
        });

        if (!existingJob) {
            return NextResponse.json({
                success: false,
                message: "Job not found"
            }, { status: 404 });
        }

        // Check if user owns the company that posted this job
        if (existingJob.company.ownerId !== user.id) {
            return NextResponse.json({
                success: false,
                message: "You can only edit jobs from your company"
            }, { status: 403 });
        }

        const updatedJob = await db.openings.update({
            where: {
                id: jobId,
            },
            data: {
                title: body.title,
                description: body.description,
                location: body.location,
                salary: body.salary,
                job_type: body.job_type,
                employment_type: body.employment_type
            }
        });

        return NextResponse.json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, {params}:{
    params: Promise<{
        id: string
    }>
}){
    try{
        const pr = await params;
        const jobId = pr.id;
        const res = await db.openings.delete({
            where:{
                id: jobId,
            }
        });
        return NextResponse.json({
            success: true,
            message: "Deleted successfully!"
        })
    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong!"
        })
    }
}

export async function POST(req: NextRequest, {params}:{
    params: Promise<{
        id: string
    }>
}){
    const pr = await params
    const jobId = pr.id;
    const body = await req.json();
    try{
        const res = await db.openings.update({
            where:{
                id: jobId,
            },
            data: {
                title: body.title,
                description: body.description,
                location: body.location,
                salary: body.salary,
                job_type: body.job_type
            }
        })
        return NextResponse.json({
            success: true,
            message: "Updated successfully!",
            data: res
        })
    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })
    }
}