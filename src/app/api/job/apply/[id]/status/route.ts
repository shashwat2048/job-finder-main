import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}) {
    try {
        const user = await getUserFromCookies();
        const { id: jobId } = await params;

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User is not authenticated!"
            }, { status: 401 });
        }
        
        const existingApplication = await db.application.findFirst({
            where: {
                user_id: user.id,
                job_id: jobId
            }
        });

        return NextResponse.json({
            success: true,
            hasApplied: !!existingApplication
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!"
        }, { status: 500 });
    }
} 