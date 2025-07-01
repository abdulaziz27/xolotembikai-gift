'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<string>('')
  const [uploadError, setUploadError] = useState<string>('')

  const supabase = createClient()

  const testUpload = async (file: File) => {
    try {
      setIsUploading(true)
      setUploadError('')
      setUploadResult('')

      // Test 1: Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('User not authenticated')
      }
      console.log('✅ User authenticated:', user.email)

      // Test 2: Check bucket existence
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      if (bucketError) throw bucketError
      
      const experienceBucket = buckets.find(b => b.id === 'experience-images')
      if (!experienceBucket) {
        throw new Error('Bucket experience-images not found')
      }
      console.log('✅ Bucket exists:', experienceBucket.name, 'Public:', experienceBucket.public)

      // Test 3: Upload file
      const fileName = `test-${Date.now()}-${file.name}`
      const filePath = `uploads/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('experience-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError
      console.log('✅ Upload successful:', data.path)

      // Test 4: Get public URL
      const { data: urlData } = supabase.storage
        .from('experience-images')
        .getPublicUrl(filePath)

      console.log('✅ Public URL:', urlData.publicUrl)
      setUploadResult(`Upload successful! File: ${fileName}, URL: ${urlData.publicUrl}`)

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Upload failed:', errorMsg)
      setUploadError(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      testUpload(file)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">🧪 Test Upload Storage</h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
      />

      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-700">🔄 Testing upload...</p>
        </div>
      )}

      {uploadResult && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700">✅ {uploadResult}</p>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">❌ Upload Error: {uploadError}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-600">Troubleshooting Steps</summary>
            <ol className="mt-2 text-sm text-red-600 list-decimal list-inside space-y-1">
              <li>Run the setup-storage.sql script in Supabase Dashboard</li>
              <li>Ensure you are logged in to the application</li>
              <li>Check that bucket 'experience-images' exists and is public</li>
              <li>Verify storage policies are created correctly</li>
            </ol>
          </details>
        </div>
      )}
    </div>
  )
} 