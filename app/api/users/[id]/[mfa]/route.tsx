import "@/app/libs/db";

import { validateEmail } from "@/app/libs/models/mfa/EmailMFA";
import MFAMethod from "@/app/libs/models/mfa/MFAMethod";
import MFAOption from "@/app/libs/models/mfa/MFAOption";
import SupportMFA from "@/app/libs/models/mfa/SupportMFA";
import User, { UserDocument } from "@/app/libs/models/User";

import OTP from "@/app/libs/models/OTP";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string; mfa: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();

    let validate;
    if (params.mfa === "email") {
      // Validate email
      validate = await validateEmail(body);
    }

    if (params.mfa === "authenticator") {
      // Validate authenticator
    }

    if (validate?.error) {
      return NextResponse.json(
        {
          error: { message: validate.error.details[0].message },
        },
        {
          status: 400,
        }
      );
    }

    // Get the user that wants to create mfa
    const user = await User.findById(params.id);

    // Check the method he wants to create if we support it
    const supportedMethod = await SupportMFA.findOne({ method: params.mfa });

    if (supportedMethod) {
      // Check if the user wants to create email mfa
      if (params.mfa === "email") {
        // Check to ensure that the user has not created this method before
        const userPopulate = await user.populate("mfamethods", {
          _id: 0,
          method: 1,
        });
        const mfaExists = (
          userPopulate.mfamethods as { method: string }[]
        ).some((mfamethods) => mfamethods.method === params.mfa.toLowerCase());
        if (mfaExists) {
          return NextResponse.json(
            {
              error: {
                message: `${params.mfa} method has been added already"`,
              },
            },
            {
              status: 409,
            }
          );
        }

        // Get user token
        const userToken = await OTP.findOne({ user: params.id });
        const seck = userToken.token.validated ? userToken.token.seck : "";

        // Create new email mfa
        const newEmailMFA = {
          // TODO: Consider setting default if it's the only one
          emails: [{ value: validate?.value.email, default: true }],
          message: `Added ${validate?.value.email}`,
          enabled: true,
          seck,
        };

        // Create new newMFAOption
        const newMFAOption = new MFAOption({
          email: newEmailMFA,
        });

        // Create a new mfamethod for user
        const newMFA = new MFAMethod({
          method: supportedMethod._id,
          user: params.id,
          option: newMFAOption._id,
        });

        // Push to the user mfas
        user?.mfamethods.push(newMFA._id);

        // TODO: Save email mfa and user update
        await newMFAOption.save();
        await newMFA.save();
        await user.save();
      }
    }

    // respond with the user
    return NextResponse.json(user, { status: 200 });
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
  try {
    // Get the users' mfas
    const user = await User.findById<UserDocument>(params.id).populate({
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

    // respond with the user
    return NextResponse.json({ user }, { status: 200 });
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
