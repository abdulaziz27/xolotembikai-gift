import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin, isUserAdmin } from "@/lib/supabase/admin";
import { Experience, ExperienceForm } from "@/types/experiences";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Check if the slug is actually an ID (UUID format)
    const isId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug
      );

    let query = supabase.from("experiences").select(`
        *,
        vendor:vendors(*)
      `);

    // Query by ID or slug
    if (isId) {
      query = query.eq("id", slug);
    } else {
      query = query.eq("slug", slug);
    }

    // Check if user is admin to show all statuses
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isAdmin = user ? await isUserAdmin(user.id) : false;

    // For non-admin users, only show active experiences
    if (!isAdmin) {
      query = query.eq("status", "active");
    }

    const { data: experience, error } = await query.single();

    if (error || !experience) {
      console.error("Experience not found:", error);
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Get reviews separately to avoid join issues
    const { data: reviews } = await supabase
      .from("experience_reviews")
      .select(
        `
        id,
        rating,
        review_text,
        created_at,
        user_id
      `
      )
      .eq("experience_id", experience.id)
      .order("created_at", { ascending: false });

    // Add reviews to experience and parse JSONB fields
    const experienceWithReviews = {
      ...experience,
      reviews: reviews || [],
      // Parse JSONB fields to proper JavaScript objects/arrays
      gallery: Array.isArray(experience.gallery)
        ? experience.gallery
        : JSON.parse(experience.gallery || "[]"),
      faqs: Array.isArray(experience.faqs)
        ? experience.faqs
        : experience.faqs
          ? JSON.parse(experience.faqs)
          : null,
      badges: Array.isArray(experience.badges)
        ? experience.badges
        : experience.badges
          ? JSON.parse(experience.badges)
          : null,
      key_features: Array.isArray(experience.key_features)
        ? experience.key_features
        : experience.key_features
          ? JSON.parse(experience.key_features)
          : null,
      available_gift_amounts: Array.isArray(experience.available_gift_amounts)
        ? experience.available_gift_amounts
        : experience.available_gift_amounts
          ? JSON.parse(experience.available_gift_amounts)
          : null,
      redeemable_locations: Array.isArray(experience.redeemable_locations)
        ? experience.redeemable_locations
        : experience.redeemable_locations
          ? JSON.parse(experience.redeemable_locations)
          : null,
      terms_conditions: Array.isArray(experience.terms_conditions)
        ? experience.terms_conditions
        : experience.terms_conditions
          ? JSON.parse(experience.terms_conditions)
          : null,
    };

    return NextResponse.json(experienceWithReviews as Experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Check if user is admin using the database function
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(user.id);

    if (!isAdmin) {
      console.error("❌ Admin check failed for user:", user.id);
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    console.log("✅ Admin check passed for user:", user.id);

    const body: Partial<ExperienceForm> = await request.json();

    // Check if the slug is actually an ID
    const isId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug
      );

    // Remove id and slug from body to prevent overwriting
    const { ...updateData } = body;

    // Use admin client for updating experience to bypass RLS
    let query = supabaseAdmin.from("experiences").update({
      ...updateData,
      updated_at: new Date().toISOString(),
    });

    // Update by ID or slug
    if (isId) {
      query = query.eq("id", slug);
    } else {
      query = query.eq("slug", slug);
    }

    const { data: experience, error } = await query
      .select(
        `
        *,
        vendor:vendors(*)
      `
      )
      .single();

    if (error) {
      console.error("❌ Error updating experience:", error);
      return NextResponse.json(
        {
          error: "Failed to update experience",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    console.log("✅ Experience updated successfully:", experience.id);
    return NextResponse.json(experience);
  } catch (error) {
    console.error("❌ Error in PUT experience API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Check if user is admin using the database function
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(user.id);

    if (!isAdmin) {
      console.error("❌ Admin check failed for user:", user.id);
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    console.log("✅ Admin check passed for user:", user.id);

    // Check if the slug is actually an ID
    const isId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug
      );

    // Use admin client for deleting experience to bypass RLS
    let query = supabaseAdmin.from("experiences").delete();

    // Delete by ID or slug
    if (isId) {
      query = query.eq("id", slug);
    } else {
      query = query.eq("slug", slug);
    }

    const { error } = await query;

    if (error) {
      console.error("❌ Error deleting experience:", error);
      return NextResponse.json(
        {
          error: "Failed to delete experience",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Experience deleted successfully");
    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("❌ Error in DELETE experience API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
