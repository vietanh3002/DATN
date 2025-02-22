/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await db.connectToDatabase();

  try {
    const user = await db.users.findByPk(parseInt(params.id), {
      attributes: {
        exclude: ["password", "provider"],
      },
      include: [
        {
          model: db.requestTutors,
        },
      ],
    });
    if (!user || user.role !== "tutor") {
      return NextResponse.json(ResponseData(null, 404, "Tutor not found!"), {
        status: 404,
      });
    }
    return NextResponse.json(ResponseData(user, 200), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      ResponseData(null, 500, "Internal server error!"),
      {
        status: 500,
      }
    );
  }
};
