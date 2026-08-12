import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay payment verification parameters.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Cryptographic HMAC-SHA256 Signature Verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'samplekeysecret';
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isSignatureValid) {
      console.error('[RAZORPAY_SIGNATURE_MISMATCH]', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { success: false, error: 'Payment verification failed: Invalid Razorpay signature.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Identify Authenticated User (if logged in)
    const serverSupabase = await createServerSupabaseClient();
    const { data: { session } } = await serverSupabase.auth.getSession();
    const userId = session?.user?.id || null;

    // 3. Create Verified Order Record in Supabase
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const newOrder = {
      id: orderId,
      user_id: userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || '',
      shipping_address: shippingAddress,
      total_amount: Number(totalAmount),
      status: 'Processing',
      payment_status: 'Paid',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      created_at: now,
      updated_at: now,
    };

    const { error: orderError } = await supabase.from('orders').insert([newOrder]);

    if (orderError) {
      console.error('[SUPABASE_ORDER_INSERT_ERROR]', orderError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to save order to database: ${orderError.message}. Please ensure the public.orders table exists in Supabase.`,
          orderId,
          paymentStatus: 'PAID'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // 4. Save Order Items
    if (items && Array.isArray(items) && items.length > 0) {
      const orderItems = items.map((item: any, idx: number) => ({
        id: `${orderId}-item-${idx}`,
        order_id: orderId,
        product_id: item.productId || item.product?.id || `prod-${idx}`,
        product_name: item.productName || item.product?.name || 'Apparel Item',
        price: item.price || item.product?.price || 0,
        quantity: item.quantity || 1,
        size: item.selectedSize || item.size || 'M',
        color: item.selectedColor?.name || item.color || 'Default',
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified and order placed successfully!',
        orderId,
        razorpay_payment_id,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('[RAZORPAY_VERIFY_PAYMENT_ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Payment verification failed.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
