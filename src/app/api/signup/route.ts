import db from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body= await req.json();

    try{
        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "User with this email already exists!"
            }, { status: 400 });
        }

        const userToCreate = {
            email : body.email,
            password: body.password,
            role: "user",
        }

        const user = await db.user.create({
            data: userToCreate
        })

        return NextResponse.json({
            success: true,
            message: "Account created successfully!",
            user: { id: user.id, email: user.email }
        });
    }catch(error){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong!"
        }, { status: 500 });
    }
}