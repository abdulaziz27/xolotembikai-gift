import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '../../../../lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

function generateVoucherCode(): string {
  const code = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `XTG-${code}`
}

function generatePassword(): string {
    return crypto.randomBytes(16).toString('hex')
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.')
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const { 
        experienceId, 
        customerName, 
        customerEmail,
      } = session.metadata as { 
        experienceId: string;
        userId: string | null;
        customerName: string;
        customerEmail: string;
       }
      
      let userId = session.metadata?.userId || null;


      if (!experienceId || !customerName || !customerEmail) {
        throw new Error('Missing metadata from Stripe session.')
      }

      // --- User Handling (Get or Create) ---
      if (!userId) {
        // Guest checkout: Check if user exists, if not create one
        const { data: existingUser, error: findError } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single()

        if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw findError
        }

        if (existingUser) {
          userId = existingUser.id
        } else {
          // Create new user in auth.users
          const password = generatePassword()
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            password: password,
            email_confirm: true,
            user_metadata: { full_name: customerName }
          })

          if (authError) throw authError
          if (!authData.user) throw new Error('Failed to create auth user.')
          
          userId = authData.user.id

          // Create profile in public.profiles
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: userId,
              full_name: customerName,
              email: customerEmail,
              role: 'user'
            })
          
          if (profileError) {
            // Log error but continue, as auth user is the critical part
            console.error('Failed to create profile for new user:', profileError)
          }
        }
      }

      if (!userId) {
          throw new Error('Could not determine user ID for the order.')
      }

      // --- Experience Details ---
      const { data: experience, error: experienceError } = await supabaseAdmin
        .from('experiences')
        .select('id, title, vendor_id, price')
        .eq('id', experienceId)
        .single()
      
      if (experienceError) throw experienceError
      if (!experience) throw new Error(`Experience with ID ${experienceId} not found.`)

      // --- Order Creation ---
      const { data: newOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          experience_id: experience.id,
          vendor_id: experience.vendor_id,
          status: 'completed', // Or 'paid', 'confirmed'
          total_amount: experience.price,
          stripe_payment_intent_id: session.payment_intent,
        })
        .select('id')
        .single()

      if (orderError) throw orderError
      if (!newOrder) throw new Error('Failed to create order.')

      // --- Voucher Creation ---
      const voucherCode = generateVoucherCode()
      const { error: voucherError } = await supabaseAdmin
        .from('vouchers')
        .insert({
          order_id: newOrder.id,
          user_id: userId,
          code: voucherCode,
          is_redeemed: false,
        })

      if (voucherError) throw voucherError

      // --- Send Confirmation Email ---
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Xolotembikai Gift <noreply@xolotembikai.com>',
          to: [customerEmail],
          subject: 'Your Xolotembikai Gift Voucher is Here!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h1 style="color: #7c3aed;">Thank You for Your Purchase!</h1>
              <p>Hello ${customerName},</p>
              <p>We're thrilled you've chosen a gift experience with us. Your voucher is ready!</p>
              
              <h2 style="color: #333;">Experience: ${experience.title}</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #555;">Your Unique Voucher Code</h3>
                <p style="font-size: 24px; font-weight: bold; color: #f97316; letter-spacing: 2px;">${voucherCode}</p>
                <p style="font-size: 12px; color: #888;">Keep this code safe. You'll need it to redeem your experience.</p>
              </div>

              <p>To view your order details or discover more experiences, please visit our website.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" 
                 style="display: inline-block; background: linear-gradient(to right, #7c3aed, #f97316); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View My Orders
              </a>
              
              <p style="margin-top: 20px;">Best regards,<br>The Xolotembikai Gift Team</p>
            </div>
          `,
        })
      }
    } catch (error: any) {
      console.error('Error handling checkout.session.completed:', error)
      return NextResponse.json({ error: `Webhook handler error: ${error.message}` }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
} 