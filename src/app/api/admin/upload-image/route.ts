import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase not configured. Check environment variables.' },
        { status: 500 }
      )
    }

    // Verify authentication
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized: ' + authResult.error },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const imageType = formData.get('imageType') as string
    const altText = formData.get('altText') as string || ''
    const isPrimary = formData.get('isPrimary') === 'true'

    console.log('Upload request received:', {
      hasFile: !!file,
      productId,
      imageType,
      isPrimary
    })

    if (!file || !productId || !imageType) {
      console.error('Missing required fields:', { hasFile: !!file, productId, imageType })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}-${imageType}-${Date.now()}.${fileExt}`

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload file to storage using service role
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('hutieu')
      .upload(fileName, uint8Array, {
        upsert: false,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // If this should be primary, set all other images to non-primary first
    if (isPrimary) {
      await supabaseAdmin
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId)
    }

    // Get next sort order
    const { data: existingImages } = await supabaseAdmin
      .from('product_images')
      .select('sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextSortOrder = existingImages && existingImages.length > 0
      ? (existingImages[0].sort_order || 0) + 1
      : 1

    // Save image record to database using service role
    const { data: imageData, error: imageError } = await supabaseAdmin
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: fileName,
        alt_text: altText,
        is_primary: isPrimary,
        type: imageType,
        sort_order: nextSortOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (imageError) {
      // If database insert fails, clean up uploaded file
      await supabaseAdmin.storage.from('hutieu').remove([fileName])
      console.error('Error saving image record:', imageError)
      return NextResponse.json(
        { error: 'Failed to save image record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imageId: imageData.id,
      fileName: fileName
    })

  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}