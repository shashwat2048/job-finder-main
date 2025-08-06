import { getUserFromCookies } from "@/hooks/helper";
import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const user = await getUserFromCookies();
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
    
    const body = await req.json();
    const dataToSave = {
        ...body,
        user_id: user.id
    }
    try{
        const review = await db.review.create({
            data: dataToSave
        });
        return NextResponse.json({
            success: true,
            data: review
        })
    }catch(error){
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        })
    }
}

export async function DELETE(req: NextRequest){
    const user = await getUserFromCookies();
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');
    
    if (!reviewId) {
        return NextResponse.json({
            success: false,
            message: "Review ID is required"
        }, { status: 400 });
    }

    try {
        // First check if the review exists and belongs to the user
        const review = await db.review.findUnique({
            where: { id: reviewId },
            include: { user: true }
        });

        if (!review) {
            return NextResponse.json({
                success: false,
                message: "Review not found"
            }, { status: 404 });
        }

        // Check if the current user is the author of the review
        if (review.user_id !== user.id) {
            return NextResponse.json({
                success: false,
                message: "You can only delete your own reviews"
            }, { status: 403 });
        }

        // Delete the review
        await db.review.delete({
            where: { id: reviewId }
        });

        return NextResponse.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}