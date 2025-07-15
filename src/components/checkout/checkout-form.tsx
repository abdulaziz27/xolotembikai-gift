"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Define a type for the user details for better type safety
interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

// The form now accepts an onDetailsChange function to report changes
export default function CheckoutForm({
  experience,
  userDetails,
  onDetailsChange,
}: {
  experience: any;
  userDetails: UserDetails;
  onDetailsChange: (details: UserDetails) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // No separate submit handler here anymore, the parent will trigger the submission
  // when it has the clientSecret and all details are ready.

  return (
    <div className="space-y-8">
      {/* Contact Information Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={userDetails.firstName}
            onChange={(e) =>
              onDetailsChange({ ...userDetails, firstName: e.target.value })
            }
            placeholder="First Name"
            className="p-3 border rounded-md"
            required
            name="firstName"
          />
          <input
            type="text"
            value={userDetails.lastName}
            onChange={(e) =>
              onDetailsChange({ ...userDetails, lastName: e.target.value })
            }
            placeholder="Last Name"
            className="p-3 border rounded-md"
            required
            name="lastName"
          />
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) =>
              onDetailsChange({ ...userDetails, email: e.target.value })
            }
            placeholder="Email Address"
            className="p-3 border rounded-md md:col-span-2"
            required
            name="email"
          />
        </div>
      </div>

      {/* Payment Information Section - Stripe's PaymentElement will handle this */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <PaymentElement id="payment-element" />
      </div>

      {/* The button is now in the parent component */}
    </div>
  );
}
