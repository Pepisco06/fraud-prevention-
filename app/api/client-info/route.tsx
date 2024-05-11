import { NextRequest, NextResponse } from "next/server";
import UAParser from "ua-parser-js";

export function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Create a new instance of UAParser
  const parser = new UAParser();
  const userAgentString = requestHeaders.get("user-agent") as string;
  const userIp = requestHeaders.get("x-forwarded-for");
  // Parse the user-agent string
  const result = parser.setUA(userAgentString).getResult();

  return NextResponse.json({ userIp, userAgent: result });
}
