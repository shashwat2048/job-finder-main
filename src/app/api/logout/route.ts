import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req:NextRequest){
    const res = NextResponse.json({
        success: true,
        message: "Logged out successfully"
    })
    res.cookies.delete('token');
    
    return res;
}