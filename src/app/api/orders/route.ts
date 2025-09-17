import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_name,
          quantity,
          product_price,
          total_price
        )
      `)
      .order('created_at', { ascending: false })

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Search functionality
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_number.ilike.%${search}%`)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      customerName,
      phone,
      email,
      address,
      productId,
      productName,
      quantity,
      notes
    } = body

    // Validate required fields
    if (!customerName || !phone || !address || !productId || !productName || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get product price from database
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price, sale_price')
      .eq('id', productId)
      .single()

    if (productError) {
      console.error('Error fetching product:', productError)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const productPrice = product.sale_price || product.price
    const totalAmount = productPrice * parseInt(quantity)

    // Generate order number
    const orderNumber = await generateOrderNumber(supabase)

    // Insert new order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: email || customerName + '@example.com', // Required field
        customer_phone: phone,
        shipping_address: address,
        total_amount: totalAmount,
        status: 'pending',
        payment_method: 'cod', // Default to cash on delivery
        payment_status: 'pending',
        notes: notes || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Insert order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: productId,
        product_name: productName,
        product_price: productPrice,
        quantity: parseInt(quantity),
        total_price: totalAmount
      })

    if (itemError) {
      console.error('Error creating order item:', itemError)
      return NextResponse.json({ error: 'Failed to create order item' }, { status: 500 })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateOrderNumber(supabase: any): Promise<string> {
  const { data, error } = await supabase
    .from('orders')
    .select('order_number')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching last order:', error)
    return 'ORD001'
  }

  if (!data || data.length === 0) {
    return 'ORD001'
  }

  const lastOrderNumber = data[0].order_number
  const match = lastOrderNumber.match(/ORD(\d+)/)

  if (match) {
    const nextNumber = parseInt(match[1]) + 1
    return `ORD${nextNumber.toString().padStart(3, '0')}`
  }

  return 'ORD001'
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}