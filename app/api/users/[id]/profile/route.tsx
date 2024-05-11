import custom400Error from "@/app/errors/custom400Error";
import "@/app/libs/db";
import Profile, { validateProfile } from "@/app/libs/models/Profile";

import User from "@/app/libs/models/User";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();

    const { value, error } = await validateProfile(body);

    if (error) {
      return NextResponse.json(custom400Error(error), {
        status: 400,
      });
    }

    // Get the user
    const user = await User.findById(params.id);
    let userProfile = user.profile;
    // Check if the user already has a profile
    if (userProfile) {
      // Update the profile instead
      userProfile.firstName = value.firstName;
      userProfile.lastName = value.lastName;
    } else {
      // Create new Profile
      userProfile = new Profile({
        firstName: value.firstName,
        lastName: value.lastName,
        user: user._id,
      });

      // Update user's profile
      user.profile = userProfile;
      await user.save();
    }

    // Save profile for user
    await userProfile.save();

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
