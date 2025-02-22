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

    const course = await db.courses.findByPk(parseInt(params.id), {
      transaction,
    });

    if (!course || course.authorId !== userToken.id) {
      return NextResponse.json(ResponseData(null, 404, "Course not found!"), {
        status: 404,
      });
    }

    const { username, email } = await req.json();

    const user = await db.users.findOne({
      where: { username, email },
      transaction,
    });

    if (!user) {
      return NextResponse.json(ResponseData(null, 409, "User not found!"), {
        status: 409,
      });
    }

    const userCourse = await db.userCourses.findOne({
      where: { userId: user.id, courseId: course.id },
      transaction,
    });

    if (userCourse) {
      return NextResponse.json(
        ResponseData(null, 409, "User already enrolled!"),
        {
          status: 409,
        }
      );
    }

    await db.userCourses.create(
      {
        userId: user.id,
        courseId: course.id,
        status: "active",
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
