/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyJWT } from "@/app/api/auth/[...nextauth]/route";
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

//update
export const PUT = async (
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

    const lesson = await db.lessons.findByPk(parseInt(params.id), {
      transaction,
    });

    if (!lesson) {
      return NextResponse.json(ResponseData(null, 404, "Lesson not found!"), {
        status: 404,
      });
    }

    if (title) lesson.title = title;
    if (linkVideo) lesson.linkVideo = linkVideo;
    if (description) lesson.description = description;

    await lesson.save({ transaction });

    await transaction.commit();
    return NextResponse.json(ResponseData(null, 200), {
      status: 200,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};

//delete
export const DELETE = async (
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
    const lesson = await db.lessons.findByPk(parseInt(params.id), {
      transaction,
    });
    if (!lesson) {
      return NextResponse.json(ResponseData(null, 404, "Lesson not found!"), {
        status: 404,
      });
    }

    const total = await db.lessons.count({
      where: {
        chapterId: lesson.chapterId,
      },
    });

    for (let i = lesson.order; i < total; i++) {
      await db.lessons.update(
        {
          order: i,
        },
        {
          where: {
            chapterId: lesson.chapterId,
            order: i + 1,
          },
          transaction,
        }
      );
    }

    await lesson.destroy({ transaction });

    await transaction.commit();
    return NextResponse.json(ResponseData(null, 204), {
      status: 204,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};
