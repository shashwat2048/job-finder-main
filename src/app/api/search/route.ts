import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../generated/prisma";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q') || "";
    const jt = searchParams.get('jt');
    const et = searchParams.get('et');
    const minSalaryParam = searchParams.get('ms');
    const ms = minSalaryParam ? Number.parseInt(minSalaryParam) : 1000;
    const pageNo = searchParams.get('page')
    const page = pageNo ? Number.parseInt(pageNo) : 1;
    const limit = 10;

    const whereClause: Prisma.OpeningsWhereInput = {
        OR: [
            {
                title: {
                    contains: q,
                    mode: "insensitive",
                },
            },
            {
                company: {
                    title: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            }
        ],
        salary: {
            gte: ms
        }
    }
    if (jt) {
        whereClause.job_type = jt;
    }
    if (et) {
        whereClause.employment_type = et;
    }
    try {
        const data = await db.openings.findMany({
            where: whereClause,
            include: {
                company: true,
            },
            take: limit,
            skip: (page - 1) * limit
        });
        return NextResponse.json(
            {
                success: true,
                data: data,
            }
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: `something went wrong! ${error}`
        })
    }

}