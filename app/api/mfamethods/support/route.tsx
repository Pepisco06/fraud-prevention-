import "@/app/libs/db";

import SupportMFA from "@/app/libs/models/mfa/SupportMFA";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mfaMethods = await SupportMFA.find();

  return NextResponse.json(mfaMethods);
}
