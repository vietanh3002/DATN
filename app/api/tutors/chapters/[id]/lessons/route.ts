/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyJWT } from "@/app/api/auth/[...nextauth]/route";
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) => {
  await db.connectToDatabase();

  const transaction = await db.sequelize.transaction();

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(ResponseData(null, 401, "Unauthorized!"), {
        status: 401,
      });
    }

    const userToken: any = await verifyJWT(token);

    if (userToken.role !== "tutor") {
      return NextResponse.json(ResponseData(null, 403, "Forbidden!"), {
        status: 403,
      });
    }

    const { title, linkVideo, description } = await req.json();

    const chapter = await db.chapters.findOne({
      where: {
        id: parseInt(params.id),
      },
      include: [
        {
          model: db.courses,
        },
      ],
      transaction,
    });

    if (!chapter || (chapter as any)?.course?.authorId !== userToken.id) {
      return NextResponse.json(ResponseData(null, 404, "Chapter not found!"), {
        status: 404,
      });
    }

    const total = await db.lessons.count({
      where: {
        chapterId: parseInt(params.id),
      },
      transaction,
    });

    await db.lessons.create(
      {
        chapterId: parseInt(params.id),
        order: total + 1,
        title,
        linkVideo,
        description,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return NextResponse.json(ResponseData(null, 201), {
      status: 201,
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error(error);
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};
