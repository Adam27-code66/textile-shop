import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    const secret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      'samplewebhooksecret';

    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[RAZORPAY_WEBHOOK_SIGNATURE_INVALID]', { signature, expectedSignature });
        return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        // Idempotent Check: Check if order is already marked Paid
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('payment_status')
          .eq('razorpay_order_id', orderId)
          .single();

        if (existingOrder && existingOrder.payment_status === 'Paid') {
          return NextResponse.json({ success: true, message: 'Webhook event already processed.' });
        }

        // Update payment status to Paid
        await supabase
          .from('orders')
          .update({
            payment_status: 'Paid',
            status: 'Processing',
            razorpay_payment_id: paymentId || undefined,
          })
          .eq('razorpay_order_id', orderId);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('[RAZORPAY_WEBHOOK_ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
