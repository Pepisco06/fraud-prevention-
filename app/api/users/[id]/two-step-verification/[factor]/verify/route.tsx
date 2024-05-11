import "@/app/libs/db";

import OTP from "@/app/libs/models/OTP";
import User from "@/app/libs/models/User";
import { MFAMethodType } from "@/app/services/mfsMethodService";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import addMFA, { FactorType } from "../../../[mfa]/addMFA";
import hasMFAMethod from "../../../[mfa]/hasMFAMethod";

interface Props {
  params: { id: string; factor: FactorType };
}

export async function POST(request: NextRequest, { params }: Props) {
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

    const user = await User.findById(params.id);

    const userPopulate = await user.populate("mfamethods", {
      _id: 0,
      method: 1,
    });

    let verified = false;

    // Check if the method the user wants to use to verify is email
    if (params.factor === "email") {
      // Check if user has mfamethods
      if (user.mfamethods && user.mfamethods.length) {
        // Find the user auth methods
        const populateEmailMethod = await user.populate({
          path: "mfamethods",
          populate: {
            path: "option",
            select: { email: 1 },
          },
        });

        // Check to ensure that the user has this method
        const userHasMFA = await hasMFAMethod(userPopulate, params.factor);
        if (userHasMFA) {
          // Get the seck
          const seck = populateEmailMethod.mfamethods[0].option.email.seck;

          // Pick the default email and send TOTP
          const defaultEmail = (
            populateEmailMethod.mfamethods as MFAMethodType[]
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
        } else {
          // Check the OTP document for temp seck
          const foundOTP = await OTP.findOne({
            user: user._id,
          });
          console.log("WE GOT 111", foundOTP);
          // Verify the otp
          verified = speakeasy.totp.verify({
            encoding: "base32",
            secret: foundOTP?.token?.seck,
            token: value.code,
            window: 6,
          });
        }
      }

      if (verified) {
        // Check the OTP document for temp seck
        const foundOTP = await OTP.findOne({
          user: user._id,
        });

        // Take the temp seck and update the users' factor
        foundOTP.token.verified = true;

        await foundOTP.save();

        const result = await addMFA(
          {
            email: {
              emails: [{ value: value.email, default: true }],
              enabled: true,
              message: `Added ${value.email}`,
              seck: foundOTP.token.seck,
            },
          },
          { factor: params.factor, userId: user._id }
        );

        if (result.error) {
          return NextResponse.json(
            {
              error: {
                message: result.error.message,
              },
            },
            {
              status: 500,
            }
          );
        }
      }

      // respond with the verification status
      return NextResponse.json({ verified }, { status: 200 });
    }

    // Check if the method the user wants to use to verify is authenticator app

    if (params.factor === "authenticator") {
      // Check if user has mfamethods
      if (user.mfamethods && user.mfamethods.length) {
        // Populate the user authenticator methods
        const populateAuthenticatorMethod = await user.populate({
          path: "mfamethods",
          populate: {
            path: "option",
            select: { authenticator: 1 },
          },
        });

        // Check to ensure that the user has this method
        const userHasMFA = await hasMFAMethod(userPopulate, params.factor);
        if (userHasMFA) {
          // Get the seck
          const seck =
            populateAuthenticatorMethod.mfamethods[0].option.authenticator.seck;

          // // Pick the default authenticator and send TOTP
          const defaultEmail = (
            populateAuthenticatorMethod.mfamethods as MFAMethodType[]
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
        } else {
          // Check the OTP document for temp seck
          const foundOTP = await OTP.findOne({
            user: user._id,
          });

          // Verify the otp
          verified = speakeasy.totp.verify({
            encoding: "base32",
            secret: foundOTP?.token?.seck,
            token: value.code,
            window: 1,
          });
        }
      }

      if (verified) {
        // Check the OTP document for temp seck
        const foundOTP = await OTP.findOne({
          user: user._id,
        });

        // Take the temp seck and update the users' temp otp verification
        foundOTP.token.verified = true;

        await foundOTP.save();

        const result = await addMFA(
          {
            authenticator: {
              authenticators: [{ value: "Authenticator", default: true }],
              enabled: true,
              message: `Added authenticator`,
              seck: foundOTP.token.seck,
            },
          },
          { factor: params.factor, userId: user._id }
        );

        if (result.error) {
          return NextResponse.json(
            {
              error: {
                message: result.error.message,
              },
            },
            {
              status: 500,
            }
          );
        }
      }

      // respond with the verification status
      return NextResponse.json({ verified }, { status: 200 });
    }

    return NextResponse.json(
      {
        error: {
          message: `${params.factor} method not supported`,
        },
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    // console.log("BIG TIME ERROR", error);
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
