import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const sp = req.nextUrl.searchParams;
        const q = sp.get('q');

        if (!q) {
            return NextResponse.json({
                success: true,
                suggestions: []
            })
        }

        const sugg = await db.openings.findMany({
            where: {
                title: {
                    contains: q,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                title: true,
            },
            take: 10
        });

        return NextResponse.json({
            success: true,
            suggestions: sugg
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong!"
        })
    }
}