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

    const {
      categoryIds,
      title,
      videoIntro,
      thumbnail,
      price,
      unitPrice,
      description,
      otherInfo,
      status,
    } = await req.json();

    const course = await db.courses.findByPk(parseInt(params.id), {
      transaction,
    });
    if (!course || course.authorId !== userToken.id) {
      return NextResponse.json(ResponseData(null, 404, "Course not found!"), {
        status: 404,
      });
    }

    if (title) course.title = title;
    if (videoIntro) course.videoIntro = videoIntro;
    if (thumbnail) course.thumbnail = thumbnail;
    if (price) course.price = price;
    if (unitPrice) course.unitPrice = unitPrice;
    if (description) course.description = description;
    if (otherInfo) course.otherInfo = otherInfo;
    if (status) course.status = status;
    if (categoryIds) {
      const newCategoryIds = categoryIds.map((categoryId: number) => ({
        courseId: course.id,
        categoryId,
      }));

      await db.categoryCourses.destroy({
        where: { courseId: course.id },
        transaction,
      });

      await db.categoryCourses.bulkCreate(newCategoryIds, {
        transaction,
      });
    }

    await course.save({ transaction });

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
    const course = await db.courses.findByPk(parseInt(params.id), {
      transaction,
    });
    if (!course || course.authorId !== userToken.id) {
      return NextResponse.json(ResponseData(null, 404, "Course not found!"), {
        status: 404,
      });
    }
    await course.destroy({ transaction });
    await db.categoryCourses.destroy({
      where: { courseId: course.id },
      transaction,
    });
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

//GET
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const course = await db.courses.findByPk(parseInt(params.id), {
      include: [
        {
          model: db.categoryCourses,
          include: [
            {
              model: db.categories,
            },
          ],
        },
        {
          model: db.chapters,
          order: [["order", "desc"]],
          include: [
            {
              model: db.lessons,
            },
          ],
        },
        {
          model: db.userCourses,
          include: [
            {
              model: db.users,
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });
    if (!course || course.authorId !== userToken.id) {
      return NextResponse.json(ResponseData(null, 404, "Course not found!"), {
        status: 404,
      });
    }
    return NextResponse.json(ResponseData(course), {
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
