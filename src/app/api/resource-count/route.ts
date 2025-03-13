import { NextResponse } from "next/server";
import axios from "axios";
import { subscriptionLimits } from "@/utils/subscriptionLimits";

// Define valid user plan types explicitly
type UserPlan = 'free' | 'personal' | 'community'; // You can extend this if needed

// Define the available resources type (habits, categories, goals, etc.)
type Resource = keyof typeof subscriptionLimits['free'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const resource = searchParams.get("resourceName");

    if (!uid || !resource) {
      return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    // Typecast resource to the correct type, ensuring it's one of the valid keys
    if (!(resource in subscriptionLimits['free'])) {
      return NextResponse.json({ error: "Invalid resource name" }, { status: 400 });
    }

    console.log("came to resource")

    // Call the backend Express API to get the resource count and plan
    const backendURL = `${process.env.API_URL}/resource-route/resource-count?uid=${uid}&resource=${resource}`;
    const response = await axios.get(backendURL);

    const resourceCount = response.data.count;
    const userPlan = response.data.plan as UserPlan; // Ensure userPlan is of type UserPlan

    // Ensure the plan is valid (this type check is more for safety)
    if (!(userPlan in subscriptionLimits)) {
      return NextResponse.json({ error: "Invalid user plan" }, { status: 400 });
    }

    // Get the limits for the specific resource based on the user's plan
    const planLimits = subscriptionLimits[userPlan];

    const resourceLimit = planLimits[resource as Resource];

    if (resourceCount >= resourceLimit) {
      // If the resource count exceeds the limit, inform the user to upgrade their plan
      return NextResponse.json({
        message: `You have reached the limit for ${resource}. Please upgrade your plan.`,
        limit: resourceLimit,
        currentCount: resourceCount,
        plan: userPlan
      }, { status: 403 });
    }

    // If the resource count is within the limit, allow the user to proceed
    return NextResponse.json({
      message: `You can create more ${resource}.`,
      limit: resourceLimit,
      currentCount: resourceCount,
      plan: userPlan
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resource count", details: error },
      { status: 500 }
    );
  }
}
