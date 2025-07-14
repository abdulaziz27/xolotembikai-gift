import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})

export async function POST(request: NextRequest) {
  try {
    const { experienceId, userId, email, name } = await request.json() // userId can be null

    if (!experienceId || !email || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required information: experience, email, and name.' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()

    // Securely fetch the experience from the database to get the real price
    const { data: experience, error: experienceError } = await supabase
      .from('experiences')
      .select('starting_price, currency, title')
      .eq('id', experienceId)
      .single()

    if (experienceError || !experience) {
      console.error('Error fetching experience:', experienceError)
      return NextResponse.json(
        { success: false, error: 'Experience not found or could not be fetched.' },
        { status: 404 }
      )
    }

    const { starting_price: amount, currency, title } = experience

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid price for the experience' },
        { status: 400 }
      )
    }

    // Create a PaymentIntent with the secure amount and currency from the database
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency || 'myr',
      receipt_email: email,
      metadata: {
        experienceId,
        userId: userId || 'guest', // Store 'guest' if userId is not provided
        customerName: name,
        customerEmail: email,
      },
      description: `Purchase of "${title}" by ${name || email}`,
    })

    // Send the client_secret back to the client
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Stripe API Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
} 