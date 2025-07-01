'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FileUploaderProps {
  onUploadComplete?: (url: string) => void
  onError?: (error: Error) => void
  bucket?: string
  acceptedFileTypes?: string
}

export default function FileUploader({
  onUploadComplete,
  onError,
  bucket = 'experience-images',
  acceptedFileTypes = 'image/*'
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const supabase = createClient()

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setErrorMessage('')

      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      console.log('🔄 Attempting to upload file:', fileName)

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        
        // Check if it's a bucket not found error
        if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket_not_found')) {
          throw new Error(`Storage bucket '${bucket}' does not exist. Please create it in your Supabase dashboard or ask your administrator.`)
        }
        
        // Check if it's a permissions error
        if (uploadError.message?.includes('permission') || uploadError.message?.includes('policy')) {
          throw new Error('You do not have permission to upload files. Please check storage policies or contact administrator.')
        }
        
        throw uploadError
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      console.log('✅ File uploaded successfully:', publicUrl)
      onUploadComplete?.(publicUrl)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed'
      console.error('❌ Upload error:', errorMsg)
      setErrorMessage(errorMsg)
      onError?.(error as Error)
    } finally {
      setIsUploading(false)
    }
  }, [bucket, onUploadComplete, onError])

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleUpload}
        accept={acceptedFileTypes}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-purple-50 file:text-purple-700
          hover:file:bg-purple-100
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isUploading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
        </div>
      )}
      {errorMessage && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <strong>Upload failed:</strong> {errorMessage}
          </p>
          <details className="mt-2">
            <summary className="text-xs cursor-pointer text-red-600">Show solution</summary>
            <div className="mt-2 text-xs text-red-600">
              <p><strong>To fix this:</strong></p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to Storage</li>
                <li>Create a bucket named '{bucket}'</li>
                <li>Set it as public</li>
                <li>Add storage policies for authenticated users</li>
              </ol>
            </div>
          </details>
        </div>
      )}
    </div>
  )
} 