/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await db.connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const query: any = {};
    if (limit && page) {
      query.limit = parseInt(limit);
      query.offset = (parseInt(page) - 1) * parseInt(limit);
    }
    const users = await db.users.findAll({
      ...query,
      where: {
        role: "tutor",
      },
      attributes: {
        exclude: ["password"],
      },
      include: [{
        model: db.requestTutors
      }, {
        model: db.infos
      }]
    });
    return NextResponse.json(ResponseData(users, 200), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      ResponseData(null, 500, "Internal server error!"),
      {
        status: 500,
      }
    );
  }
};
