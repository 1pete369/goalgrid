import { subscriptionLimits, SubscriptionPlan } from "@/utils/subscriptionLimits";
import { useMemo } from "react";
// import { subscriptionLimits, SubscriptionPlan } from "../utils/subscriptionLimits";

interface User {
  customData?: {
    subscription?: SubscriptionPlan;
  };
}

const useSubscription = (user: User) => {
  const plan: SubscriptionPlan = user?.customData?.subscription || "free";
  const limits = useMemo(() => subscriptionLimits[plan], [plan]);

  return { plan, limits };
};

export default useSubscription;
