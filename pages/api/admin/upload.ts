import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for formidable
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Check if BLOB_READ_WRITE_TOKEN is available
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set')
    return res.status(500).json({ message: 'Blob storage not configured' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Parse the form data
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      maxFields: 10,
      maxFieldsSize: 20 * 1024 * 1024, // 20MB total for all fields
      filter: ({ mimetype }) => {
        // Only allow image files
        return Boolean(mimetype && mimetype.startsWith('image/'))
      },
    })

    const [fields, files] = await form.parse(req)
    
    if (!files.files || !Array.isArray(files.files)) {
      return res.status(400).json({ message: 'No files uploaded' })
    }
    const uploadedFiles = []
    
    for (const file of files.files) {
      if (!file.filepath || !file.originalFilename) {
        console.warn('Skipping file with missing filepath or originalFilename:', file)
        continue
      }
      
      try {
        // Generate unique random filename (no spaces, clean format)
        const timestamp = Date.now()
        const extension = file.originalFilename.split('.').pop() || 'jpg'
        const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const filename = `upload_${timestamp}_${randomString}.${extension}`
        
        console.log(`[Upload] Processing file:`, {
          originalFilename: file.originalFilename,
          generatedFilename: filename,
          size: file.size,
          mimetype: file.mimetype,
        })
        
        // Read the file buffer
        const fs = await import('fs')
        const fileBuffer = fs.readFileSync(file.filepath)
        
        console.log(`[Upload] Read file buffer, size: ${fileBuffer.length} bytes`)
        
        // Upload to Vercel Blob
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          addRandomSuffix: true,
        })
        
        console.log(`[Upload] Successfully uploaded to Vercel Blob:`, {
          url: blob.url,
          pathname: blob.pathname,
        })
        
            uploadedFiles.push({
              filename: blob.pathname, // Store just the filename/pathname
              url: blob.url, // Full URL for immediate use
              originalName: file.originalFilename,
              size: file.size,
              mimetype: file.mimetype,
            })
        
        // Clean up temporary file
        fs.unlinkSync(file.filepath)
      } catch (fileError: any) {
        console.error('[Upload] Error uploading file:', {
          error: fileError.message,
          stack: fileError.stack,
          originalFilename: file.originalFilename,
        })
        // Continue with other files even if one fails
      }
    }

    if (uploadedFiles.length === 0) {
      console.error('[Upload] No files were successfully uploaded')
      return res.status(400).json({ 
        message: 'Failed to upload any files',
        error: 'All file uploads failed. Check server logs for details.'
      })
    }

    console.log(`[Upload] Successfully uploaded ${uploadedFiles.length} file(s)`)
    return res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    })
  } catch (error: any) {
    console.error('[Upload] Error uploading files:', {
      error: error.message,
      stack: error.stack,
    })
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred during upload'
    })
  }
}
