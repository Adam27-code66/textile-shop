import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
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
    const { items, customerName, customerEmail, customerPhone, shippingAddress } = body;

    // 1. Validate Cart Input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty. Cannot create order.' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!customerName || !customerEmail || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer details (name, email, shipping address).' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Fetch authoritative product prices directly from Supabase DB
    const productIds = items.map((i: any) => i.productId || i.product?.id).filter(Boolean);

    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, price, stock_status')
      .in('id', productIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve products from database.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 3. Server-side Calculation & Stock Validation
    let subtotal = 0;
    for (const item of items) {
      const pid = item.productId || item.product?.id;
      const dbProduct = productMap.get(pid);

      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product "${item.productName || pid}" not found.` },
          { status: 400, headers: corsHeaders }
        );
      }

      if (dbProduct.stock_status === 'Out of Stock') {
        return NextResponse.json(
          { success: false, error: `Product "${dbProduct.name}" is currently out of stock.` },
          { status: 400, headers: corsHeaders }
        );
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const serverPrice = Number(dbProduct.price);
      subtotal += serverPrice * qty;
    }

    // Free shipping above ₹1,999, else ₹149 shipping
    const shipping = subtotal > 1999 ? 0 : 149;
    const grandTotal = subtotal + shipping;
    const amountInPaise = Math.round(grandTotal * 100);

    // 4. Initialize Razorpay Client (Server side only)
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_samplekeyid';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'samplekeysecret';

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone ? customerPhone.trim() : '',
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId,
        grandTotal,
        subtotal,
        shipping,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('[RAZORPAY_CREATE_ORDER_ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create Razorpay order.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
