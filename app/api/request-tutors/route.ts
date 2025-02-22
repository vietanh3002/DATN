/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../auth/[...nextauth]/route";

export const PUT = async (req: NextRequest) => {
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

    const { proposedCourses, expertise, experience } = await req.json();

    console.log(userToken);

    const user = await db.users.findOne({
      where: { id: userToken.id },
      transaction, // Pass transaction
    });

    if (!user) {
      await transaction.rollback();
      return NextResponse.json(ResponseData(null, 404, "User not found!"), {
        status: 404,
      });
    }

    user.role = "request-tutor";

    await user.save({ transaction });

    await db.requestTutors.create(
      {
        userId: user.id,
        proposedCourses,
        expertise,
        experience,
      },
      { transaction }
    );
    await transaction.commit();

    return NextResponse.json(ResponseData(null, 201), {
      status: 201,
    });
  } catch (error: any) {
    console.error(error);
    await transaction.rollback();

    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};
