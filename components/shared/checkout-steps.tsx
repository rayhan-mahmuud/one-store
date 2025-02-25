import { CHECKOUT_STEPS_ARRAY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import React from "react";

export default function CheckoutSteps({ current = 0 }) {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2">
      {CHECKOUT_STEPS_ARRAY.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === current ? "bg-secondary" : ""
            )}
          >
            {step}
          </div>
          {step !== CHECKOUT_STEPS_ARRAY[CHECKOUT_STEPS_ARRAY.length - 1] && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
