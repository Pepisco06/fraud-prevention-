import "@/app/libs/db";

import User from "@/app/libs/models/User";
import { MFAMethodType } from "@/app/services/mfsMethodService";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import UAParser from "ua-parser-js";
import { FactorType } from "../../[id]/[mfa]/addMFA";
import hasMFAMethod from "../../[id]/[mfa]/hasMFAMethod";

interface Props {
  params: { factor: FactorType };
}

export async function POST(request: NextRequest, { params }: Props) {
  const requestHeaders = new Headers(request.headers);

  // Create a new instance of UAParser
  const parser = new UAParser();
  const userAgentString = requestHeaders.get("user-agent") as string;
  const userIp = requestHeaders.get("x-forwarded-for");
  // Parse the user-agent string
  const result = parser.setUA(userAgentString).getResult();

  try {
    const body = await request.json();

    const { value, error } = await Joi.object({
      code: Joi.string().required().min(6),
      email: Joi.string().email().required(),
    }).validate(body);

    if (error) {
      return NextResponse.json(
        {
          error: {
            message: error.details[0].message,
          },
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne(
      { email: value.email },
      { password: 0, __v: 0 }
    );

    const populatedUser = await user.populate({
      path: "mfamethods",
      populate: [
        {
          path: "method",
        },
        {
          path: "option",
        },
      ],
    });

    // return NextResponse.json(populatedUser);

    let verified = false;

    // Check if the method the user wants to use to verify is email
    if (params.factor === "email") {
      // Check if user has mfamethods
      if (user.mfamethods && user.mfamethods.length) {
        // Check to ensure that the user has this method
        const userHasMFA = await hasMFAMethod(user, params.factor);
        if (!userHasMFA) {
          // Get the seck
          const seck = populatedUser.mfamethods[0].option.email.seck;
          // Pick the default email and send TOTP
          const defaultEmail = (
            populatedUser.mfamethods as MFAMethodType[]
          )[0].option.email.emails.find(
            (email: { default: boolean }) => email.default === true
          );

          // Verify the otp
          verified = speakeasy.totp.verify({
            encoding: "base32",
            secret: seck,
            token: value.code,
            window: 1,
          });
        }
      }

      if (!verified) {
        return NextResponse.json(
          {
            error: {
              message:
                "Verification failed. Is either code has expired or incorrect. Try signing in again.",
            },
          },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json(
        {
          user: populatedUser,
          userIp,
          agent: { os: { ...result.os } },
          verified,
        },
        {
          status: 200,
        }
      );
    }

    // Check if the method the user wants to use to verify is authenticator app

    if (params.factor === "authenticator") {
      // Check if user has mfamethods
      if (user.mfamethods && user.mfamethods.length) {
        // Check to ensure that the user has this method
        const userHasMFA = await hasMFAMethod(user, params.factor);
        if (userHasMFA) {
          // Get the seck
          const seck = populatedUser.mfamethods[0].option.authenticator.seck;

          // // Pick the default authenticator and send TOTP
          const defaultEmail = (
            populatedUser.mfamethods as MFAMethodType[]
          )[0].option.authenticator.authenticators.find(
            (authenticator: { default: boolean }) =>
              authenticator.default === true
          );

          // Verify the otp
          verified = speakeasy.totp.verify({
            encoding: "base32",
            secret: seck,
            token: value.code,
            window: 1,
          });
        }
      }

      if (!verified) {
        return NextResponse.json(
          {
            error: {
              message: "Verification failed try again",
            },
          },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json(
        {
          user: populatedUser,
          userIp,
          agent: { os: { ...result.os } },
          verified,
        },
        {
          status: 200,
        }
      );
    }
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
