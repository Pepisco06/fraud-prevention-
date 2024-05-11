import "@/app/libs/db";
import { sendEmail } from "@/app/libs/mail/nodemailerEmailService";
import OTP from "@/app/libs/models/OTP";

import User from "@/app/libs/models/User";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import hasTempSec from "./hasTempSec";
import mongoose from "mongoose";

interface Props {
  params: { id: string; factor: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const seck = speakeasy.generateSecret();

    const user = await User.findById(params.id);

    // Check what method the user wants to use to generate
    if (params.factor === "email") {
      // Validate the body
      const body = await request.json();

      const { error, value } = await Joi.object({
        email: Joi.string().email().required(),
      }).validate(body);

      if (error) {
        return NextResponse.json(
          {
            error: { message: error.details[0].message },
          },
          {
            status: 400,
          }
        );
      }

      // Generate an OTP code based on the secret key for EMAIL
      const otp: string = speakeasy.totp({
        secret: seck.base32,
        encoding: "base32",
      });

      await sendEmail({
        to: value.email,
        subject: "Verifiy Token",
        text: `Use this code: ${otp}`,
      });

      // Check if temp sec already exists for user
      if (await hasTempSec(params.id)) {
        // If exists delete them
        await OTP.deleteMany({ user: params.id });
      }

      // Store seck temproraly
      await OTP.create({
        user: user,
        token: { seck: seck.base32, verified: false },
      });

      return NextResponse.json(
        {
          message: `Email sent to ${value.email}`,
        },
        { status: 200 }
      );
    }

    if (params.factor === "authenticator") {
      // Get the data URL of the authenticator URL
      const dataURL = await QRCode.toDataURL(seck.otpauth_url || "");

      // Check if temp sec already exists for user
      const hasTempSeck = await hasTempSec(params.id);

      if (hasTempSeck) {
        // If exists delete them
        await OTP.deleteMany({ user: new mongoose.Types.ObjectId(params.id) });
      }

      // Store seck temproraly
      await OTP.create({
        user: user,
        token: { seck: seck.base32, verified: false },
      });

      return NextResponse.json({ dataURL });
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
