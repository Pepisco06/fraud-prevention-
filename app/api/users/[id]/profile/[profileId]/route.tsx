import "@/app/libs/db";
import Profile from "@/app/libs/models/Profile";

import User from "@/app/libs/models/User";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { profileId: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Get the users' mfas
    const userProfile = await Profile.findById(params.profileId);

    // respond with the user
    return NextResponse.json(userProfile, { status: 200 });
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
