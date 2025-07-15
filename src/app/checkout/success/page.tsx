"use client";

import { Check, Eye, Gift, Home, HelpCircle, CalendarDays } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { Order, Voucher, Experience } from "@/types";

// Component that uses useSearchParams - must be inside Suspense
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // We now get payment_intent from the URL, not session_id
  const paymentIntentId = searchParams.get("payment_intent");

  const [order, setOrder] = useState<Order | null>(null);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading your order details..."
  );

  useEffect(() => {
    if (!paymentIntentId) {
      setError("No payment intent ID found.");
      setLoading(false);
      return;
    }

    let attempt = 0;
    const maxRetries = 15; // 15 retries * 2 seconds = 30 seconds total wait time
    const interval = 2000; // 2 seconds

    const fetchOrder = async () => {
      attempt++;
      setLoadingMessage(
        `Preparing your order... (Attempt ${attempt}/${maxRetries})`
      );

      try {
        // Corrected API endpoint
        const res = await fetch(`/api/order/${paymentIntentId}`);

        if (res.ok) {
          const orderData = await res.json();
          // The API returns the full order object including nested experience and voucher
          setOrder(orderData);
          setExperience(orderData.experiences); // Assuming the join brings in 'experiences' object
          setVoucher(orderData.vouchers ? orderData.vouchers[0] : null); // Handle case where voucher might not exist
          setLoading(false);
          setError(null);
          return; // Stop polling
        }

        // Only stop polling on definitive errors like 400 or 401.
        // For 404 (not found yet) or 500 (server error, maybe transient), we retry.
        if (
          (res.status === 404 || res.status === 500) &&
          attempt < maxRetries
        ) {
          setTimeout(fetchOrder, interval);
        } else {
          // For other errors or after max retries, show final error
          const errorData = await res
            .json()
            .catch(() => ({ error: "An unexpected error occurred." }));
          throw new Error(
            errorData.error ||
              `Failed to fetch order details. Status: ${res.status}`
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order details.");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentIntentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!order || !experience || !voucher) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Order Details Not Available
          </h1>
          <p className="text-gray-700">
            We could not find the details for your recent order.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const isGift =
    voucher.recipient_email ||
    voucher.recipient_name ||
    voucher.personal_message;
  const displayRecipient =
    voucher.recipient_name || voucher.recipient_email || "You";

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🎉</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Payment Successful!
            </h1>
            <span className="text-2xl">🎉</span>
          </div>

          <p className="text-lg text-gray-600 mb-4">
            {isGift
              ? `Your gift for ${displayRecipient} is confirmed!`
              : "Your experience is confirmed!"}
          </p>

          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold inline-block">
            Order {order.id.substring(0, 8).toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            </div>

            <div className="flex items-start space-x-4">
              <Image
                src={experience.featured_image || "/placeholder.svg"}
                alt={experience.title}
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">
                  {experience.title}
                </h3>
                {/* <p className="text-sm text-gray-600 mb-2">Wellness & Spa</p> */}
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium inline-block mb-3">
                  Voucher Code:{" "}
                  <span className="font-bold">{voucher.code}</span>
                </div>
                {isGift && voucher.personal_message && (
                  <p className="text-sm text-gray-600 italic">
                    "{voucher.personal_message}"
                  </p>
                )}
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency || "MYR",
                    }).format(Number(order.total_amount) || 0)}
                  </span>
                </div>
              </div>
            </div>

            {voucher.delivery_scheduled_at && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">
                  Delivery Details
                </h3>
                <p className="text-sm text-gray-600">
                  Scheduled for:{" "}
                  {new Date(voucher.delivery_scheduled_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Method: {voucher.delivery_method}
                </p>
              </div>
            )}
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <CalendarDays className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                What Happens Next?
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Confirmation Email Sent
                  </h3>
                  <p className="text-sm text-gray-600">
                    Check {isGift ? displayRecipient : "your"} inbox for order
                    details and booking instructions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Book Your Experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use your voucher code to book your preferred date and time
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Enjoy Your Experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    Relax and enjoy your premium {experience.title} experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Our customer support team is available 24/7 to assist you with
                  any questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/account/orders")}
            className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>View Order Details</span>
          </button>

          <button
            onClick={() => router.push("/experiences")}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Gift className="w-5 h-5" />
            <span>Send Another Gift</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Homepage</span>
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@givva.com"
              className="text-purple-600 hover:text-purple-700"
            >
              support@givva.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:+60312345678"
              className="text-purple-600 hover:text-purple-700"
            >
              +60 3 1234 5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your order details...</p>
      </div>
    </div>
  );
}

// Main page component that wraps PaymentSuccessContent in Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
