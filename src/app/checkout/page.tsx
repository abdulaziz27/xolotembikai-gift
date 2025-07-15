"use client";

import { useEffect, useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRef } from "react";
import { ArrowLeft, Zap, Clock, Award, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Load Stripe outside of a component's render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// This is the main form component, now living inside the page structure
function CheckoutForm({
  experience,
  paymentIntentId,
  isGift,
  giftData,
}: {
  experience: any;
  paymentIntentId: string;
  isGift: boolean;
  giftData: any;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
  });
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntentId) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Update the PaymentIntent with the final customer details
      const updateRes = await fetch("/api/checkout/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: email,
          experienceId: experience.id,
          giftData: isGift ? giftData : null,
        }),
      });

      if (!updateRes.ok) {
        const { error } = await updateRes.json();
        throw new Error(error || "Failed to update payment details.");
      }

      // 2. Confirm the payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          receipt_email: email,
        },
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  // Get the base price from the experience
  const subtotal = experience?.starting_price || 0;
  // Only apply discount if the experience has one
  const discount = experience?.discount || 0;
  const processingFee = 0;
  // Calculate total after discount
  const totalAmount = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {" "}
      {/* Added top padding for navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        {/* Checkout Now Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">
                  🔥 Checkout Now - Gift Arrives Instantly via Email, Text or
                  WhatsApp!
                </h2>
                <div className="flex items-center space-x-6 mt-2 text-white text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>High demand - book today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Premium experience awaits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact & Payment */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We'll send your confirmation here
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userDetails.firstName}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userDetails.lastName}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                💳 Payment Information
              </h2>
              <div className="mb-6">
                <PaymentElement id="payment-element" />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {experience && (
                <div>
                  {/* Experience Details */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={experience.featured_image || "/placeholder.svg"}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {experience.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {experience.category}
                      </p>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium inline-block">
                        Valid 12 months
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount}</span>
                      </div>
                    )}
                    {processingFee > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Processing Fee</span>
                        <span>${processingFee}</span>
                      </div>
                    )}
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${totalAmount}</span>
                    </div>
                  </div>

                  {/* Complete Purchase Button */}
                  <form onSubmit={handleSubmit}>
                    <button
                      disabled={isProcessing || !stripe || !elements}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span className="text-xl">🔒</span>
                      <span>
                        {isProcessing
                          ? "Processing..."
                          : `Complete Purchase - $${totalAmount}`}
                      </span>
                    </button>
                  </form>

                  {/* Security Info */}
                  <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>256-bit SSL encrypted</span>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Your payment information is secure and protected
                  </p>

                  {/* What happens next? */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      What happens next?
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">
                          Instant confirmation email
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">
                          Book when you're ready
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">
                          24/7 customer support
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component that uses useSearchParams - must be inside Suspense
function CheckoutContent() {
  const searchParams = useSearchParams();
  const experienceId = searchParams.get("experienceId");

  // Extract gift data from URL params
  const isGift = searchParams.get("isGift") === "true";
  const giftData = {
    recipientName: searchParams.get("recipientName") || "",
    recipientEmail: searchParams.get("recipientEmail") || "",
    recipientPhone: searchParams.get("recipientPhone") || "",
    personalMessage: searchParams.get("personalMessage") || "",
    deliveryMethod: searchParams.get("deliveryMethod") || "",
    deliveryDate: searchParams.get("deliveryDate") || "",
  };

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!experienceId) {
      setError("No experience selected.");
      setLoading(false);
      return;
    }

    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    const fetchCheckoutData = async () => {
      try {
        const expRes = await fetch(`/api/experiences/${experienceId}`);
        if (!expRes.ok) throw new Error("Failed to fetch experience details.");
        const expData = await expRes.json();
        setExperience(expData);

        const piRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceId,
            isGift,
            giftData: isGift ? giftData : null,
          }),
        });

        if (!piRes.ok) throw new Error("Failed to initialize payment.");
        const piData = await piRes.json();
        if (piData.error) throw new Error(piData.error);
        setClientSecret(piData.clientSecret);
        setPaymentIntentId(piData.paymentIntentId);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [experienceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const appearance = { theme: "stripe" as const };
  const options = { clientSecret, appearance };

  return (
    <>
      {clientSecret && paymentIntentId && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            experience={experience}
            paymentIntentId={paymentIntentId}
            isGift={isGift}
            giftData={giftData}
          />
        </Elements>
      )}
    </>
  );
}

// Loading component for Suspense fallback
function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Checkout...</p>
      </div>
    </div>
  );
}

// Main page component that wraps CheckoutContent in Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
