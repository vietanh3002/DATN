/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyJWT } from "@/app/api/auth/[...nextauth]/route";
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
      lessonId: string;
    };
  }
) => {
  await db.connectToDatabase();

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
    const chapter: any = await db.chapters.findOne({
      where: {
        id: parseInt(params.id),
      },
      include: [
        {
          model: db.courses,
          include: [
            {
              model: db.users,
            },
          ],
        },
      ],
    });

    if (!chapter || chapter?.course?.user.id !== userToken.id) {
      return NextResponse.json(ResponseData(null, 404, "Lesson not found!"), {
        status: 404,
      });
    }

    const lessons = await db.lessons.findOne({
      where: {
        chapterId: parseInt(params.id),
        id: parseInt(params.lessonId),
      },
    });

    return NextResponse.json(ResponseData(lessons, 200), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(ResponseData(null, 500, "Internal Server Error"), {
      status: 500,
    });
  }
};
