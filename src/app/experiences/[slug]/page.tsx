"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  Heart,
  Share,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  Gift,
} from "lucide-react";
import Image from "next/image";
import { Experience } from "@/types/experiences";
import { experienceService, experienceUtils } from "@/lib/services/experiences";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleMapComponent from "@/components/ui/google-map";
import { currencyUtils, CURRENCIES } from "@/lib/utils/currency";
import { Calendar as DatePicker } from "@/components/ui/calendar";

interface ExperienceDetailProps {
  params: Promise<{ slug: string }>;
}

function ExperienceDetailContent({ params }: ExperienceDetailProps) {
  const router = useRouter(); // Moved hook to the top level
  const [experienceData, setExperienceData] = useState<Experience | null>(null);
  const [similarExperiences, setSimilarExperiences] = useState<Experience[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get experience type from URL params
  const searchParams = useSearchParams();
  const experienceType =
    searchParams.get("type") ||
    (experienceData
      ? experienceUtils.getExperienceType(experienceData.category)
      : "booking");

  // Set default tab based on experience type
  const defaultTab =
    experienceType === "gift-card" ? "how-it-works" : "whats-included";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [giftOption, setGiftOption] = useState("gift-someone");
  const [isGiftDetailsOpen, setIsGiftDetailsOpen] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("");
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [selectedGiftAmount, setSelectedGiftAmount] = useState(100);

  // Gift form data
  const [giftFormData, setGiftFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    personalMessage: "",
    deliveryMethod: "",
    deliveryDate: "",
    senderName: "",
    senderEmail: "",
  });

  // Fetch experience data and similar experiences
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const { slug } = await params;
        const data = await experienceService.getExperienceBySlug(slug);
        setExperienceData(data);

        // Fetch similar experiences
        try {
          const similar = await experienceService.getSimilarExperiences(
            data.id,
            data.category,
            4
          );
          setSimilarExperiences(similar);
        } catch (similarError) {
          console.error("Error fetching similar experiences:", similarError);
          // Don't fail the whole page if similar experiences fail
        }
      } catch (error) {
        console.error("Error fetching experience:", error);
        setError("Experience not found");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experienceData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Experience Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "The experience you're looking for doesn't exist."}
          </p>
          <Link
            href="/experiences"
            className="text-purple-600 hover:text-purple-800"
          >
            ← Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic pricing calculation using database values
  const basePriceMYR = Number(experienceData.starting_price);
  const discountPercentage = experienceData.discount_percentage || 25; // Use database value or fallback
  const originalPriceMYR = experienceData.original_price
    ? Number(experienceData.original_price)
    : currencyUtils.calculateOriginalPrice(basePriceMYR, discountPercentage);

  // Transform data for component compatibility
  const experience = {
    title: experienceData.title,
    provider: experienceData.vendor?.name || "Experience Provider",
    rating: experienceData.rating,
    originalPrice: originalPriceMYR,
    discountedPrice: basePriceMYR,
    discount: currencyUtils.calculateDiscountPercentage(
      originalPriceMYR,
      basePriceMYR
    ),
    location: {
      name: experienceData.vendor?.name || "Experience Location",
      address: experienceData.address || experienceData.location || "Location",
      phone: experienceData.contact_phone || "Contact for details",
    },
    badges: experienceData.badges?.map((badge: any) => {
      // Map string icon names to actual React components
      const iconMap: { [key: string]: any } = {
        Star,
        Gift,
        Phone,
        Check,
        Calendar,
        Heart,
        MapPin,
      };

      // If badge is a string (old format), convert to object
      if (typeof badge === "string") {
        return {
          icon: Star,
          text: badge,
          color: "text-purple-500",
        };
      }

      // If badge is an object with icon string, convert icon to component
      return {
        icon: iconMap[badge.icon] || Star,
        text: badge.text,
        color: badge.color || "text-purple-500",
      };
    }) || [
      {
        icon: Star,
        text: `${experienceUtils.formatRating(experienceData.rating)} Rating`,
        color: "text-yellow-500",
      },
      { icon: Gift, text: "Instant Delivery", color: "text-orange-500" },
      { icon: Phone, text: "Mobile Friendly", color: "text-blue-500" },
      { icon: Check, text: "100% Satisfaction", color: "text-pink-500" },
      {
        icon: Calendar,
        text: `Valid ${experienceData.validity_period_months || 12} Months`,
        color: "text-red-500",
      },
    ],
    description: experienceData.long_description,
    includes: experienceData.inclusions || [],
    images: experienceData.featured_image
      ? [
          experienceData.featured_image,
          ...(Array.isArray(experienceData.gallery)
            ? experienceData.gallery
            : JSON.parse(experienceData.gallery || "[]")
          ).slice(0, 4),
        ]
      : [
          "https://via.placeholder.com/600x400/A855F7/FFFFFF?text=" +
            encodeURIComponent(experienceData.category),
          "https://via.placeholder.com/300x200/F97316/FFFFFF?text=Image1",
          "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Image2",
          "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Image3",
          "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Image4",
        ],
  };

  // Get gift card amounts from database or use defaults
  const giftCardAmounts = experienceData?.available_gift_amounts || [
    100, 200, 300, 750,
  ];

  const currentCurrency =
    currencyUtils.getCurrency(selectedCurrency) || CURRENCIES[0];

  // Calculate current price in selected currency
  const currentDiscountedPrice = currencyUtils.convertPrice(
    basePriceMYR,
    selectedCurrency
  );
  const currentOriginalPrice = currencyUtils.convertPrice(
    originalPriceMYR,
    selectedCurrency
  );
  const currentPrice =
    experienceType === "gift-card"
      ? selectedGiftAmount
      : currentDiscountedPrice;

  // Get FAQs from database or use defaults
  const faqs = experienceData?.faqs || [
    {
      question: "Can I reschedule my appointment?",
      answer:
        "Yes, you can reschedule up to 24 hours before your appointment without any fees.",
    },
    {
      question: "What should I bring?",
      answer:
        "Just bring yourself! We provide all spa amenities including robes, slippers, and towels.",
    },
    {
      question: "Is there an age restriction?",
      answer: "This experience is designed for adults 18 years and older.",
    },
    {
      question: "Can I extend my gift card validity?",
      answer: `Gift cards are valid for ${experienceData?.validity_period_months || 12} months and cannot be extended beyond this period.`,
    },
  ];

  const deliveryModes = [
    { id: "email", name: "Email", icon: "📧", field: "Email Address" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", field: "WhatsApp Number" },
    { id: "sms", name: "Text Message", icon: "💬", field: "Phone Number" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {experienceType === "gift-card"
                  ? `${experience.provider} Gift Card`
                  : experience.title}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 mb-6">
                {experience.badges.map((badge, index) => {
                  const IconComponent = badge.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${badge.color}`} />
                      <span className="text-sm text-gray-600">
                        {badge.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Gift Card Description */}
              {experienceType === "gift-card" && (
                <div className="mb-6">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    The perfect gift for any occasion. Give the gift of
                    relaxation and wellness. Our gift cards can be used for any
                    service or experience at {experience.provider}, from
                    luxurious massages and facials to full spa day packages.
                  </p>
                </div>
              )}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="col-span-2 lg:col-span-2">
                <Image
                  src={experience.images[0]}
                  alt="Main experience image"
                  width={600}
                  height={320}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl"
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {experience.images.slice(1).map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Experience image ${index + 2}`}
                    width={300}
                    height={200}
                    className="w-full h-28 lg:h-[75px] object-cover rounded-xl"
                  />
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap border-b border-gray-200">
                {(experienceType === "booking"
                  ? [
                      { id: "whats-included", label: "What's Included" },
                      { id: "redemption", label: "Redemption" },
                      { id: "faq", label: "FAQ" },
                      { id: "fine-print", label: "Fine Print" },
                    ]
                  : [
                      { id: "how-it-works", label: "How It Works" },
                      { id: "gift-benefits", label: "Gift Card Benefits" },
                      { id: "faq", label: "FAQ" },
                      { id: "fine-print", label: "Fine Print" },
                    ]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {/* Experience Booking Tabs */}
              {experienceType === "booking" &&
                activeTab === "whats-included" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Overview
                    </h2>
                    <p className="text-gray-700 mb-8 leading-relaxed">
                      {experience.description}
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      This experience includes:
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {experience.includes.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Gift Card Tabs */}
              {experienceType === "gift-card" &&
                activeTab === "how-it-works" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      How It Works
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">
                            Choose Your Amount
                          </h3>
                          <p className="text-gray-600">
                            Select from preset amounts or enter a custom value
                            between $100-$1,000.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">
                            Personalize Your Gift
                          </h3>
                          <p className="text-gray-600">
                            Add a personal message and choose how to deliver the
                            gift card.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">
                            Instant Delivery
                          </h3>
                          <p className="text-gray-600">
                            Digital gift card delivered instantly via email,
                            WhatsApp, or text.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {experienceType === "gift-card" &&
                activeTab === "gift-benefits" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Gift Card Benefits
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          What's Included:
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Valid for all spa services
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              No expiry date
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Transferable to friends & family
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Can be used multiple times
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Perfect For:
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Gift className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Birthdays & anniversaries
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Gift className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Corporate gifts
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Gift className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Holiday presents
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Gift className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Self-care treats
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === "redemption" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    How to Redeem Your Gift Card
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Book Your Appointment
                        </h3>
                        <p className="text-gray-600">
                          Call our spa directly at (555) 123-4567 or book online
                          using your gift card code.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Present Your Gift Card
                        </h3>
                        <p className="text-gray-600">
                          Show your digital gift card or provide the unique code
                          at the time of your visit.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Enjoy Your Experience
                        </h3>
                        <p className="text-gray-600">
                          Relax and enjoy your luxury spa day experience!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "faq" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h3 className="font-bold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "fine-print" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Terms & Conditions
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      • Gift cards are valid for 12 months from the date of
                      purchase and cannot be extended.
                    </p>
                    <p>
                      • Appointments must be scheduled in advance and are
                      subject to availability.
                    </p>
                    <p>
                      • Gift cards are non-refundable and cannot be exchanged
                      for cash.
                    </p>
                    <p>
                      • 24-hour cancellation policy applies to avoid forfeiture
                      of gift card value.
                    </p>
                    <p>
                      • Gift cards cannot be combined with other offers or
                      promotions.
                    </p>
                    <p>• Lost or stolen gift cards cannot be replaced.</p>
                    <p>
                      • Service gratuities are not included and are at the
                      discretion of the guest.
                    </p>
                    <p>• Valid only at Grand Serenity Hotel Spa location.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-900">Location</h2>
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-gray-900">
                  {experience.location.name}
                </h3>
                <p className="text-gray-600">{experience.location.address}</p>
                <p className="text-gray-600">
                  Phone: {experience.location.phone}
                </p>
              </div>
              <GoogleMapComponent
                address={
                  experienceData.address ||
                  experienceData.location ||
                  "Kuala Lumpur, Malaysia"
                }
                name={experienceData.title}
                className="rounded-2xl overflow-hidden"
              />
            </div>

            {/* Redeemable Locations - Gift Card Only */}
            {experienceType === "gift-card" && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Redeemable Locations
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Use your gift card at any of our spa locations.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(
                    experienceData?.redeemable_locations || [
                      {
                        name: "Spa XYZ - Downtown Plaza",
                        address: "123 Wellness Boulevard, Downtown",
                      },
                      {
                        name: "Spa XYZ - Marina Bay",
                        address: "456 Waterfront Drive, Marina",
                      },
                      {
                        name: "Spa XYZ - Orchard Central",
                        address: "789 Shopping Street, Orchard",
                      },
                      {
                        name: "Spa XYZ - Sentosa Resort",
                        address: "321 Beach Resort, Sentosa Island",
                      },
                    ]
                  ).map((location, index) => {
                    const colors = [
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-orange-600",
                      "bg-red-500",
                    ];
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-6 h-6 ${colors[index % colors.length]} text-white rounded-full flex items-center justify-center text-sm font-bold`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {location.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {location.address}
                          </p>
                          {location.phone && (
                            <p className="text-gray-600 text-sm">
                              Phone: {location.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Similar Experiences */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {experienceType === "gift-card"
                  ? "Other Gift Cards You Might Like"
                  : "Similar Gift Experiences You Might Like"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarExperiences.map((similar) => {
                  // Use database values for pricing calculation
                  const similarDiscountPercentage =
                    similar.discount_percentage || 25;
                  const discountedPrice = Number(similar.starting_price);
                  const originalPrice = similar.original_price
                    ? Number(similar.original_price)
                    : currencyUtils.calculateOriginalPrice(
                        discountedPrice,
                        similarDiscountPercentage
                      );
                  const savings = originalPrice - discountedPrice;

                  return (
                    <div
                      key={similar.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/experiences/${similar.slug}`)
                      }
                    >
                      <div className="relative">
                        <Image
                          src={
                            similar.featured_image ||
                            "https://via.placeholder.com/300x200/A855F7/FFFFFF?text=" +
                              encodeURIComponent(similar.category)
                          }
                          alt={similar.title}
                          width={300}
                          height={160}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Save ${savings}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">
                          {similar.title}
                        </h3>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-gray-900">
                            {Number(similar.rating).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ${discountedPrice}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                {/* Price Header */}
                <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold">
                        {currentCurrency.symbol}
                        {currentPrice.toLocaleString()}
                      </span>
                      {experienceType === "booking" && (
                        <span className="text-lg text-purple-100 line-through">
                          {currencyUtils.formatPrice(
                            currentOriginalPrice,
                            selectedCurrency
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowCurrencySelector(!showCurrencySelector)
                        }
                        className="bg-white/20 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1"
                      >
                        <span>{selectedCurrency}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showCurrencySelector && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-10">
                          {CURRENCIES.map((currency) => (
                            <button
                              key={currency.code}
                              onClick={() => {
                                setSelectedCurrency(currency.code);
                                setShowCurrencySelector(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              {currency.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {experienceType === "booking" && (
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold inline-block">
                      Save {discountPercentage}%
                    </div>
                  )}
                  {experienceType === "gift-card" && (
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold inline-block">
                      Gift Card Value
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Gift Card Amount Selection */}
                  {experienceType === "gift-card" && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Choose Gift Card Amount:
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {giftCardAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setSelectedGiftAmount(amount)}
                            className={`py-3 px-4 text-sm font-semibold rounded-lg transition-colors ${
                              selectedGiftAmount === amount
                                ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Amount
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="1000"
                          placeholder="Enter custom amount"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onChange={(e) =>
                            setSelectedGiftAmount(
                              parseInt(e.target.value) || 100
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Option Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Choose your option:
                    </h3>
                    <div className="flex rounded-xl overflow-hidden">
                      <button
                        onClick={() => setGiftOption("for-myself")}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                          giftOption === "for-myself"
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white border border-gray-300 text-gray-700"
                        }`}
                      >
                        {experienceType === "gift-card"
                          ? "Gift Myself"
                          : "For Myself"}
                      </button>
                      <button
                        onClick={() => setGiftOption("gift-someone")}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${
                          giftOption === "gift-someone"
                            ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white"
                            : "bg-white border-l-0 border border-gray-300 text-gray-700"
                        }`}
                      >
                        <Gift className="w-4 h-4" />
                        <span>Gift Someone</span>
                      </button>
                    </div>
                  </div>

                  {/* Gift Details Form */}
                  {giftOption === "gift-someone" && (
                    <div className="mb-6">
                      <button
                        onClick={() => setIsGiftDetailsOpen(!isGiftDetailsOpen)}
                        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg text-left"
                      >
                        <span className="font-semibold text-gray-900">
                          Gift Details
                        </span>
                        {isGiftDetailsOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {isGiftDetailsOpen && (
                        <div className="mt-4 space-y-4">
                          {/* Recipient Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Recipient's Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter recipient's full name"
                              value={giftFormData.recipientName}
                              onChange={(e) =>
                                setGiftFormData((prev) => ({
                                  ...prev,
                                  recipientName: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Delivery Mode */}
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Delivery Mode
                            </label>
                            <button
                              onClick={() =>
                                setShowDeliveryOptions(!showDeliveryOptions)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-500 flex items-center justify-between"
                            >
                              <span>
                                {selectedDeliveryMode ||
                                  "Choose delivery method"}
                              </span>
                              <ChevronDown className="w-4 h-4" />
                            </button>

                            {showDeliveryOptions && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                {deliveryModes.map((mode) => (
                                  <button
                                    key={mode.id}
                                    onClick={() => {
                                      setSelectedDeliveryMode(mode.name);
                                      setGiftFormData((prev) => ({
                                        ...prev,
                                        deliveryMethod: mode.id,
                                      }));
                                      setShowDeliveryOptions(false);
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                  >
                                    <span>{mode.icon}</span>
                                    <span>{mode.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Additional Field based on delivery mode */}
                          {selectedDeliveryMode && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {
                                  deliveryModes.find(
                                    (m) => m.name === selectedDeliveryMode
                                  )?.field
                                }
                              </label>
                              <input
                                type={
                                  selectedDeliveryMode === "Email"
                                    ? "email"
                                    : "tel"
                                }
                                placeholder={
                                  selectedDeliveryMode === "Email"
                                    ? "Enter email address"
                                    : selectedDeliveryMode === "WhatsApp"
                                      ? "+1 (555) 123-4567"
                                      : "Enter phone number"
                                }
                                value={
                                  selectedDeliveryMode === "Email"
                                    ? giftFormData.recipientEmail
                                    : giftFormData.recipientPhone
                                }
                                onChange={(e) => {
                                  if (selectedDeliveryMode === "Email") {
                                    setGiftFormData((prev) => ({
                                      ...prev,
                                      recipientEmail: e.target.value,
                                    }));
                                  } else {
                                    setGiftFormData((prev) => ({
                                      ...prev,
                                      recipientPhone: e.target.value,
                                    }));
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          )}

                          {/* Delivery Date */}
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Delivery Date
                            </label>
                            <button
                              onClick={() => setShowCalendar(!showCalendar)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-500 flex items-center justify-between"
                            >
                              <span>
                                {giftFormData.deliveryDate
                                  ? new Date(
                                      giftFormData.deliveryDate
                                    ).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Pick a delivery date"}
                              </span>
                              <Calendar className="w-4 h-4" />
                            </button>

                            {showCalendar && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-20">
                                <DatePicker
                                  mode="single"
                                  selected={
                                    giftFormData.deliveryDate
                                      ? new Date(giftFormData.deliveryDate)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      const formattedDate = date
                                        .toISOString()
                                        .split("T")[0];
                                      setGiftFormData((prev) => ({
                                        ...prev,
                                        deliveryDate: formattedDate,
                                      }));
                                      setShowCalendar(false);
                                    }
                                  }}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </div>
                            )}
                          </div>

                          {/* Personal Message */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Personal Message (Optional)
                            </label>
                            <textarea
                              placeholder="Add a personal message..."
                              rows={3}
                              value={giftFormData.personalMessage}
                              onChange={(e) =>
                                setGiftFormData((prev) => ({
                                  ...prev,
                                  personalMessage: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-lg font-bold mb-2">
                      <span>Total:</span>
                      <span className="text-2xl">
                        {currentCurrency.symbol}
                        {currentPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {experienceType === "gift-card"
                        ? "Digital gift card will be sent to recipient"
                        : "Booking confirmation will be sent via email"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        const searchParams = new URLSearchParams({
                          experienceId: experienceData.id,
                          currency: selectedCurrency,
                          price: currentPrice.toString(),
                          isGift: (giftOption === "gift-someone").toString(),
                          ...(giftOption === "gift-someone" && {
                            recipientName: giftFormData.recipientName,
                            recipientEmail: giftFormData.recipientEmail,
                            recipientPhone: giftFormData.recipientPhone,
                            personalMessage: giftFormData.personalMessage,
                            deliveryMethod: giftFormData.deliveryMethod,
                            deliveryDate: giftFormData.deliveryDate,
                          }),
                        });
                        router.push(`/checkout?${searchParams.toString()}`);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:shadow-lg transition-all"
                    >
                      {experienceType === "gift-card"
                        ? "Buy Gift Card"
                        : "Book Now"}{" "}
                      -{" "}
                      {currencyUtils.formatPrice(
                        currentPrice,
                        selectedCurrency
                      )}
                    </button>

                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Save to Wishlist</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
                        <Share className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free cancellation up to 24h</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Valid for 12 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceDetailPage(props: ExperienceDetailProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <ExperienceDetailContent {...props} />
    </Suspense>
  );
}
