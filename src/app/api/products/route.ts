import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Attempt to fetch products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      // If table doesn't exist yet or has error, return fallback response
      return NextResponse.json({
        success: true,
        source: 'fallback',
        message: 'Supabase table not seeded yet, returning API status.',
        data: []
      });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase',
      data: products
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
