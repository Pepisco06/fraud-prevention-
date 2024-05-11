import "@/app/libs/db";

import User from "@/app/libs/models/User";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Get the users' mfas
    const user = await User.findById(params.id).populate({
      path: "mfamethods",
      populate: [
        {
          path: "option",
          select: { _id: 0 },
        },
        { path: "method", select: { _id: 0, method: 1 } },
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
