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
    const { productId, imageId } = body

    if (!productId || !imageId) {
      return NextResponse.json(
        { error: 'Product ID and Image ID are required' },
        { status: 400 }
      )
    }

    // Set all images to non-primary
    const { error: updateAllError } = await supabaseAdmin
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId)

    if (updateAllError) {
      console.error('Error updating all images:', updateAllError)
      return NextResponse.json(
        { error: 'Failed to reset primary images' },
        { status: 500 }
      )
    }

    // Set selected image as primary
    const { error: setPrimaryError } = await supabaseAdmin
      .from('product_images')
      .update({ is_primary: true })
      .eq('id', imageId)

    if (setPrimaryError) {
      console.error('Error setting primary image:', setPrimaryError)
      return NextResponse.json(
        { error: 'Failed to set primary image' },
        { status: 500 }
      )
    }

    // Trigger revalidation of product pages
    try {
      const revalidateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '/san-pham',
          tag: 'products',
          secret: process.env.REVALIDATE_SECRET || 'default-secret'
        })
      })

      if (revalidateResponse.ok) {
        console.log('Successfully triggered revalidation')
      }
    } catch (revalidateError) {
      console.error('Failed to trigger revalidation:', revalidateError)
      // Continue execution even if revalidation fails
    }

    return NextResponse.json({
      success: true,
      message: 'Primary image set successfully'
    })

  } catch (error) {
    console.error('Error in set primary image API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}