/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  await db.connectToDatabase();

  try {
    const categories = await db.categories.findAll({});

    return NextResponse.json(ResponseData(categories, 200), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(ResponseData(null, 500, "Internal Server Error"), {
      status: 500,
    });
  }
};
