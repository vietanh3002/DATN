/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyJWT } from "@/app/api/auth/[...nextauth]/route";
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { NextRequest, NextResponse } from "next/server";

// DELETE
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
    if (userToken.role !== "admin") {
      return NextResponse.json(ResponseData(null, 403, "Forbidden!"), {
        status: 403,
      });
    }
    const user = await db.users.findByPk(parseInt(params.id), {
      transaction,
    });
    if (!user) {
      await transaction.rollback();
      return NextResponse.json(ResponseData(null, 404, "User not found!"), {
        status: 404,
      });
    }

    await user.destroy({ transaction });
    await transaction.commit();
    return NextResponse.json(ResponseData(null, 204), {
      status: 204,
    });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};

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

    if (userToken.role !== "admin") {
      return NextResponse.json(ResponseData(null, 403, "Forbidden!"), {
        status: 403,
      });
    }

    const { role } = await req.json();

    const user = await db.users.findOne({
      where: { id: parseInt(params.id) },
      transaction,
    });
    if (!user) {
      await transaction.rollback();
      return NextResponse.json(ResponseData(null, 404, "User not found!"), {
        status: 404,
      });
    }
    user.role = role;
    await user.save({ transaction });
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
