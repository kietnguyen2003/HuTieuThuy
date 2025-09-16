import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageId, altText, imageType } = body

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Update image info
    const { error } = await supabaseAdmin
      .from('product_images')
      .update({
        alt_text: altText || '',
        type: imageType || 'product_gallery',
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId)

    if (error) {
      console.error('Error updating image info:', error)
      return NextResponse.json(
        { error: 'Failed to update image info' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image info updated successfully'
    })

  } catch (error) {
    console.error('Error in update image API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}