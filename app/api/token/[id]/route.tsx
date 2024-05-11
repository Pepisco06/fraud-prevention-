import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  console.log("params", params.id);

  // Use the code
  return NextResponse.json({
    status: 200,
  });
}
