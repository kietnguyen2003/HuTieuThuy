import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, tag, secret } = body

    // Simple authentication (you should use a proper secret)
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    if (tag) {
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }

    // Revalidate common pages
    revalidatePath('/san-pham')
    revalidatePath('/')
    revalidateTag('products')

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || 'multiple paths',
      tag: tag || 'products'
    })
  } catch (err) {
    console.error('Error revalidating:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}