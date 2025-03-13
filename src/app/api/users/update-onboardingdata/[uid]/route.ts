import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request, { params }: { params: Promise< { uid: string }> }) {
  const uid = (await params).uid
  const onBoardingData = await req.json();

  try {
    const response = await axios.patch(`${process.env.API_URL}/users/update-onboardingdata/${uid}`, onBoardingData);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update onboarding data" }, { status: 500 });
  }
}
