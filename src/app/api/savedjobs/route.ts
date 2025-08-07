import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated!"
            }, { status: 401 });
        }

        const savedJobs = await db.savedJob.findMany({
            where: {
                user_id: user.id
            },
            include: {
                job: {
                    include: {
                        company: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: savedJobs
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error!"
        }, { status: 500 });
    }
}
