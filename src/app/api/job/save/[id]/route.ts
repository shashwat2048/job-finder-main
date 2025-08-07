import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {
    params: Promise<{
        id: string
    }>
}) {
    try {
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated!"
            }, { status: 401 });
        }

        const pr = await params;
        const jobId = pr.id;

        // Check if user has saved this job
        const savedJob = await db.savedJob.findFirst({
            where: {
                user_id: user.id,
                job_id: jobId
            }
        });

        return NextResponse.json({
            success: true,
            isSaved: !!savedJob
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest, {params}: {
    params: Promise<{
        id: string
    }>
}) {
    try {
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated!"
            }, { status: 401 });
        }

        const pr = await params;
        const jobId = pr.id;

        // Check if job exists
        const job = await db.openings.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return NextResponse.json({
                success: false,
                message: "Job not found!"
            }, { status: 404 });
        }

        // Check if user has already saved this job
        const existingSavedJob = await db.savedJob.findFirst({
            where: {
                user_id: user.id,
                job_id: jobId
            }
        });

        if (existingSavedJob) {
            return NextResponse.json({
                success: false,
                message: "Job already saved!"
            }, { status: 409 });
        }

        // Save the job
        const savedJob = await db.savedJob.create({
            data: {
                user_id: user.id,
                job_id: jobId
            }
        });

        return NextResponse.json({
            success: true,
            message: "Job saved successfully!",
            data: savedJob
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!"
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, {params}: {
    params: Promise<{
        id: string
    }>
}) {
    try {
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated!"
            }, { status: 401 });
        }

        const pr = await params;
        const jobId = pr.id;

        // Find and delete the saved job
        const savedJob = await db.savedJob.findFirst({
            where: {
                user_id: user.id,
                job_id: jobId
            }
        });

        if (!savedJob) {
            return NextResponse.json({
                success: false,
                message: "Job not found in saved jobs!"
            }, { status: 404 });
        }

        await db.savedJob.delete({
            where: { id: savedJob.id }
        });

        return NextResponse.json({
            success: true,
            message: "Job removed from saved jobs!"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!"
        }, { status: 500 });
    }
}
