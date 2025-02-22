/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyJWT } from "@/app/api/auth/[...nextauth]/route";
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await db.connectToDatabase();

  try {
    let publicCourse = true;
    let userToken: any;
    let owner = false;
    const tokens = req.headers.get("Authorization")?.split(" ");
    if (!tokens || tokens.length < 2) {
      publicCourse = true;
    } else {
      publicCourse = false;
      userToken = await verifyJWT(tokens[1]);
    }

    if (!publicCourse) {
      const userCourse = await db.userCourses.findOne({
        where: { userId: userToken.id, courseId: parseInt(params.id) },
      });
      if (!userCourse || userCourse.status !== "active") {
        owner = false;
      } else {
        owner = true;
      }
    }
    let query: any = {};

    if (owner) {
      query = {
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
      };
    } else {
      query = {
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
            include: [
              {
                model: db.lessons,
                attributes: ["id", "title"],
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
      };
    }
    const course = await db.courses.findOne({
      ...query,
      where: {
        status: "published",
        id: parseInt(params.id),
      },
    });
    return NextResponse.json(ResponseData({ course, owner }), {
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
