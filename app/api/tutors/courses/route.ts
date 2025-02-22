/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../auth/[...nextauth]/route";

export const POST = async (req: NextRequest) => {
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

    const newCourse = new db.courses();

    newCourse.title = title;
    newCourse.videoIntro = videoIntro;
    newCourse.thumbnail = thumbnail;
    newCourse.price = price;
    newCourse.unitPrice = unitPrice;
    newCourse.authorId = userToken.id;
    newCourse.description = description;
    newCourse.otherInfo = otherInfo;
    newCourse.status = status;
    newCourse.totalRate = 5;
    await newCourse.save({ transaction });

    const courseCategoryIds = categoryIds.map((categoryId: number) => ({
      courseId: newCourse.id,
      categoryId,
    }));

    await db.categoryCourses.bulkCreate(courseCategoryIds, {
      transaction,
    });

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

//GET
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
    if (userToken.role !== "tutor") {
      return NextResponse.json(ResponseData(null, 403, "Forbidden!"), {
        status: 403,
      });
    }
    const courses = await db.courses.findAll({
      where: {
        authorId: userToken.id,
      },
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
        },
      ],
    });

    return NextResponse.json(ResponseData(courses, 200), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(ResponseData(null, 500, "Internal Server Error"), {
      status: 500,
    });
  }
};
