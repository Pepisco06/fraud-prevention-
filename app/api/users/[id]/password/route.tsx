import custom400Error from "@/app/errors/custom400Error";
import "@/app/libs/db";
import Profile, { validateProfile } from "@/app/libs/models/Profile";

import User from "@/app/libs/models/User";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();

    const { value, error } = await Joi.object({
      password: Joi.string().min(8).required().label("Password"),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm Password")
        .messages({ "any.only": "Passwords must match" }),
    }).validate(body);

    if (error) {
      console.log("ERRROR", error);
      return NextResponse.json(custom400Error(error), {
        status: 400,
      });
    }

    // Get the user
    const user = await User.findById(params.id);
    // Update the password field
    user.password = value.password;

    await user.save();

    // respond with the user
    return NextResponse.json({ message: "Password Changed" }, { status: 201 });
  } catch (error) {
    console.log("CATCH", error);
    return NextResponse.json(
      {
        error: { message: (error as Error).message },
      },
      {
        status: 500,
      }
    );
  }
}
