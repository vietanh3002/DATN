/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { verifyJWT } from "../auth/[...nextauth]/route";

export const PUT = async (req: NextRequest) => {
  await db.connectToDatabase();

  try {
    const { description, image, email } = await req.json();

    const user = await db.users.findOne({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(ResponseData(null, 404, "User not found!"), {
        status: 404,
      });
    }

    const info = await db.infos.findOne({
      where: { userId: user.id },
    });

    if (info) {
      await db.infos.update(
        {
          description,
          image,
        },
        {
          where: { userId: user.id },
        }
      );
    } else {
      await db.infos.create({
        userId: user.id,
        description,
        image,
      });
    }

    return NextResponse.json(ResponseData(null, 201), {
      status: 201,
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        ResponseData(null, 401, error.issues[0].message),
        {
          status: 401,
        }
      );
    }
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};

export const GET = async (req: NextRequest) => {
  await db.connectToDatabase();
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(ResponseData(null, 401, "Unauthorized!"), {
        status: 401,
      });
    }

    const userToken = await verifyJWT(token);

    const user = await db.users.findOne({
      where: { id: (userToken as any).id },
      include: [
        {
          model: db.infos,
        },
      ],
    });

    if (!user) {
      return NextResponse.json(ResponseData(null, 404, "User not found!"), {
        status: 404,
      });
    }

    return NextResponse.json(ResponseData(user, 200), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};
