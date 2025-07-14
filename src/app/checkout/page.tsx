'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { ArrowLeft, Shield, User } from 'lucide-react'
import Image from 'next/image'
import { experienceService } from '@/lib/services/experiences'
import { useAuth } from '@/components/providers/auth-provider'
import type { Experience } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

function CheckoutFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile } = useAuth() // We still use auth to pre-fill info if logged in

  const [experience, setExperience] = useState<Experience | null>(null)
  const [customer, setCustomer] = useState({ name: '', email: '' })
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const experienceId = searchParams.get('experienceId')

  // Pre-fill customer details if user is logged in
  useEffect(() => {
    if (profile) {
      setCustomer({ name: profile.full_name || '', email: profile.email || '' })
    }
  }, [profile])

  // Fetch experience details on page load
  useEffect(() => {
    if (!experienceId) {
      router.push('/')
      return;
    }
    const fetchExperience = async () => {
      try {
        setLoading(true)
        const expData = await experienceService.getExperienceById(experienceId)
        setExperience(expData)
      } catch (err) {
        setError('Could not load experience details.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [experienceId, router])

  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!experience || !customer.email || !customer.name) {
      setError('Please provide your name and email.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: experience.id,
          userId: profile?.id, // Optional: will be null for guests
          email: customer.email,
          name: customer.name,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setClientSecret(data.clientSecret)
      } else {
        setError(data.error || 'Failed to initialize payment.')
      }
    } catch (err) {
      setError('Could not connect to payment service.')
    } finally {
      setLoading(false)
    }
  }

  if (!experience && loading) {
     return (
        <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading experience...</p>
            </div>
        </div>
    )
  }

  if (error) {
     return <div className="p-8 text-center text-red-500">{error}</div>
  }
  
  if (!experience) {
      return <div className="p-8 text-center">Experience not found.</div>;
  }
  
  const appearance = { theme: 'stripe' as const, variables: { colorPrimary: '#7c3aed' } }
  const options = { clientSecret, appearance }

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side: Order Summary */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8">
        <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
        
        <div className="bg-white rounded-lg p-4 flex items-center gap-4">
            <Image 
            src={experience.featured_image || '/placeholder.svg'}
            alt={experience.title}
            width={80}
            height={80}
            className="rounded-lg object-cover"
            />
            <div>
            <h3 className="font-semibold text-gray-800">{experience.title}</h3>
            <p className="text-sm text-gray-500">by {experience.vendor?.name || 'In-house'}</p>
            <p className="text-lg font-bold text-purple-600 mt-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: experience.currency || 'MYR' }).format(experience.starting_price)}
            </p>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: experience.currency || 'MYR' }).format(experience.starting_price)}</span>
            </div>
                <div className="flex justify-between text-gray-600 mt-2">
                <span>Taxes & Fees</span>
                <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 mt-4">
                <span>Total</span>
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: experience.currency || 'MYR' }).format(experience.starting_price)}</span>
            </div>
        </div>
        </div>

        {/* Right Side: Customer Info & Payment */}
        <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
            
            {!clientSecret ? (
              <form onSubmit={handleCreatePaymentIntent} className="space-y-4">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} placeholder="John Doe" required />
                </div>
                 <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} placeholder="you@example.com" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </form>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Paying as:</p>
                    <p className="font-semibold text-gray-800">{customer.name} ({customer.email})</p>
                </div>
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
              </div>
            )}

            <div className="mt-6 flex items-center text-gray-500 text-sm">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>Secure payment powered by Stripe.</span>
            </div>
        </div>
    </div>
  )
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
                <Suspense fallback={<div>Loading Checkout...</div>}>
                    <CheckoutFlow />
                </Suspense>
            </div>
        </div>
    )
} 