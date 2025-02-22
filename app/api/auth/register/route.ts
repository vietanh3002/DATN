/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/app/lib/connect";
import ResponseData from "@/app/lib/response_data";
import { Users } from "@/database/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import env from "@/env";
import { signUpSchema } from "@/app/lib/zob";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  await db.connectToDatabase();
  try {
    const data = await req.json();
    const { username, email, password } = await signUpSchema.parseAsync(data);
    const existUser = await db.users.findOne({
      where: { email },
    });
    if (existUser) {
      return NextResponse.json(
        ResponseData(null, 409, "Email already exists!"),
        {
          status: 409,
        }
      );
    }
    const user: Users = new db.users();
    user.username = username;
    user.email = email;
    user.password = await bcrypt.hash(password, env.bcrypt.saltRounds);
    await user.save();
    return NextResponse.json(ResponseData(user, 201), {
      status: 201,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        ResponseData(null, 401, error.issues[0].message),
        {
          status: 401,
        }
      );
    }
    return NextResponse.json(ResponseData(null, 400, "Bad request!"), {
      status: 400,
    });
  }
};
