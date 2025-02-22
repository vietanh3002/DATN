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

    const { title } = await req.json();

    const chapter = await db.chapters.findByPk(parseInt(params.id), {
      transaction,
    });

    if (!chapter) {
      return NextResponse.json(ResponseData(null, 404, "Chapter not found!"), {
        status: 404,
      });
    }

    if (title) chapter.title = title;

    await chapter.save({ transaction });

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
    const chapter = await db.chapters.findByPk(parseInt(params.id), {
      transaction,
    });
    if (!chapter) {
      return NextResponse.json(ResponseData(null, 404, "Chapter not found!"), {
        status: 404,
      });
    }

    const total = await db.chapters.count({
      where: {
        courseId: chapter.courseId,
      },
    });

    for (let i = chapter.order; i < total; i++) {
      await db.chapters.update(
        {
          order: i,
        },
        {
          where: {
            courseId: chapter.courseId,
            order: i + 1,
          },
          transaction,
        }
      );
    }

    await chapter.destroy({ transaction });

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
