import "@/app/libs/db";

import htmlTemplate from "@/app/libs/mail/htmlTemplate";
import { sendEmail } from "@/app/libs/mail/nodemailerEmailService";
import OTP from "@/app/libs/models/OTP";
import User, { validateUser } from "@/app/libs/models/User";
import generateOTPCode from "@/app/libs/utils/generateOTPCode";
import custom400Error from "@/app/errors/custom400Error";
import { MFAMethodType } from "@/app/services/mfsMethodService";
import { NextRequest, NextResponse } from "next/server";
import UAParser from "ua-parser-js";
import getDefaultEmail from "./getDefaultEmail";

export async function GET(request: NextRequest) {
  const users = await User.find();
  return NextResponse.json({ results: users });
}

export async function POST(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Create a new instance of UAParser
  const parser = new UAParser();
  const userAgentString = requestHeaders.get("user-agent") as string;
  const userIp = requestHeaders.get("x-forwarded-for");
  // Parse the user-agent string
  const result = parser.setUA(userAgentString).getResult();

  try {
    const body = await request.json();
    const { value, error } = await validateUser(body);

    if (error) {
      return NextResponse.json(custom400Error(error), {
        status: 400,
      });
    }

    // Check if user already exists
    const foundUser = await User.findOne({ email: value.email }, { __v: 0 });

    if (foundUser) {
      // Confirm the password is correct
      if (foundUser.password === value.password) {
        // Check if the user has mfa configured
        if (foundUser.mfamethods && foundUser.mfamethods.length) {
          // Populate user mfamethods
          const populateUser = await foundUser.populate({
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

          // Generate code and send to email
          const defaultEmail = await getDefaultEmail(populateUser);
          const mfaMethod = (populateUser.mfamethods as MFAMethodType[]).find(
            (method) => method.method.method === "email"
          );

          const code = generateOTPCode(mfaMethod?.option.email.seck);

          await sendEmail({
            to: defaultEmail.value,
            subject: "Verification Code",
            text: `Use this code to proceed with login: ${code}`,
          });

          return NextResponse.json(
            {
              message: `Verification code sent to ${defaultEmail.value}`,
              code,
              agent: { os: { ...result.os } },
            },
            {
              status: 200,
            }
          );
        } else {
          // Check if the ip address is in users' ip address list
          const ipAddressExists = (foundUser.ips as string[]).some(
            (ip) => ip === userIp
          );
          // Check if the user is trying to login from different IP
          if (!ipAddressExists) {
            // twilioPhoneService();
            const otpCode = generateOTPCode();
            const newOtp = await OTP.create({
              user: foundUser,
              code: otpCode,
              ip: userIp,
            });

            // Notify user via email of new ip address
            sendEmail({
              to: foundUser.email,
              subject: "Alert: Suspicious Activity Detected on Your Account",
              html: htmlTemplate({
                firstName: foundUser.firstName,
                varificationCode: otpCode,
                oi: newOtp._id,
              }),
            });

            return NextResponse.json(
              {
                error: {
                  message: `We noticed a change from your IP address. 
                  Hence, you will need to confirm is you that is trying to login. 
                  Please check your email for instructions on how to do so.`,
                },
              },
              {
                status: 401,
              }
            );
          }
        }

        // IP is in users' IP address list and user has not yet set mfa
        return NextResponse.json(
          { user: foundUser, userIp, agent: { os: { ...result.os } } },
          {
            status: 200,
          }
        );
      }

      return NextResponse.json(
        { error: { message: "Email / Password incorrect" } },
        {
          status: 401,
        }
      );
    }

    // If user is not found create new user on the goal
    const newUser = new User({ ...value, ips: [userIp] });
    const savedUser = await newUser.save();

    const populateUser = await User.findById(savedUser._id, {
      password: 0,
      __v: 0,
    }).populate({
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

    return NextResponse.json(
      { user: foundUser, userIp, agent: { os: { ...result.os } } },
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
