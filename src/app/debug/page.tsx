"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"

export default function DebugPage() {
  const { user, profile, loading } = useAuth()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Your debug logic here
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || !profile) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({ user, profile }, null, 2)}
        </pre>
      </div>

      {data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 