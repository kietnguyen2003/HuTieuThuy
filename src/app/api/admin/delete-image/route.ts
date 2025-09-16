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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Get image info first
    const { data: imageData, error: fetchError } = await supabaseAdmin
      .from('product_images')
      .select('image_url')
      .eq('id', imageId)
      .single()

    if (fetchError) {
      console.error('Error fetching image:', fetchError)
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('hutieu')
      .remove([imageData.image_url])

    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      // Don't return error here, continue with database deletion
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('product_images')
      .delete()
      .eq('id', imageId)

    if (dbError) {
      console.error('Error deleting image record:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete image record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Error in delete image API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}