import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    return NextResponse.json(
      { success: true, data: orders || [] },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      items
    } = body;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || '',
      shipping_address: shippingAddress,
      total_amount: Number(totalAmount),
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('orders').insert([newOrder]).select();

    if (items && Array.isArray(items)) {
      const orderItems = items.map((item: any, idx: number) => ({
        id: `${orderId}-item-${idx}`,
        order_id: orderId,
        product_id: item.productId || item.product?.id,
        product_name: item.productName || item.product?.name,
        price: item.price || item.product?.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor?.name
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    return NextResponse.json(
      { success: true, message: 'Order placed successfully!', orderId },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Order creation failed.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    const { orderId, status } = body;

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    return NextResponse.json(
      { success: true, message: `Order ${orderId} updated to ${status}` },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
