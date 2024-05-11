import OTP from "@/app/libs/models/OTP";
import User from "@/app/libs/models/User";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();

    const { value, error } = await Joi.object({
      code: Joi.string().required().min(6),
    }).validate(body);

    if (error) {
      return NextResponse.json(
        { error: { message: error.details[0].message } },
        {
          status: 400,
        }
      );
    }

    const tokenData = await OTP.findById(params.id);

    console.log("tokenData", tokenData);

    if (!tokenData) {
      return NextResponse.json(
        {
          error: {
            message:
              "The code you entered has either been used, expired or incorrect",
          },
        },
        {
          status: 400,
        }
      );
    }

    // Add ip address to the list of users ip
    const foundUser = await User.findById(tokenData.user);
    foundUser.ips.push(tokenData.ip);
    await foundUser.save();

    // Delete the token so it can't be re-used
    await OTP.findByIdAndDelete(params.id);

    // Use the code
    return NextResponse.json(
      {
        message: "Verification successful",
        status: 200,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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

export async function GET(request: NextRequest, { params }: Props) {
  console.log("params", params.id);

  // Use the code
  return NextResponse.json({
    status: 200,
  });
}
