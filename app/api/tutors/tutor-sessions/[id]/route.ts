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

    const {
      tutoringDay,
      startTime,
      linkMeet,
      document,
      absenceReason,
      studyStatus,
    } = await req.json();

    const session = await db.tutoringSessions.findByPk(parseInt(params.id), {
      transaction,
    });

    if (!session) {
      return NextResponse.json(ResponseData(null, 404, "Chapter not found!"), {
        status: 404,
      });
    }

    if (tutoringDay) session.tutoringDay = tutoringDay;
    if (startTime) session.startTime = startTime;
    if (linkMeet) session.linkMeet = linkMeet;
    if (document) session.document = document;
    if (absenceReason) session.absenceReason = absenceReason;
    if (studyStatus) session.studyStatus = studyStatus;
    await session.save({ transaction });

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
    const session = await db.tutoringSessions.findByPk(parseInt(params.id), {
      transaction,
    });

    if (!session) {
      return NextResponse.json(ResponseData(null, 404, "Chapter not found!"), {
        status: 404,
      });
    }

    await session.destroy({ transaction });

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
