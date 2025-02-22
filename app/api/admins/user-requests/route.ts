/* eslint-disable @typescript-eslint/no-explicit-any */
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../auth/[...nextauth]/route";
import db from "@/app/lib/connect";

export const GET = async (req: NextRequest) => {
  await db.connectToDatabase();
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(ResponseData(null, 401, "Unauthorized!"), {
        status: 401,
      });
    }
    const userToken: any = await verifyJWT(token);
    if (userToken.role !== "admin") {
      return NextResponse.json(ResponseData(null, 403, "Forbidden!"), {
        status: 403,
      });
    }
    const users = await db.users.findAll({
      where: {
        role: "request-tutor",
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.requestTutors,
        },
      ],
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
