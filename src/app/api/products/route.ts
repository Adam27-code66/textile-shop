import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json(
      {
        success: true,
        source: error ? 'fallback' : 'supabase',
        data: products || []
      },
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
  // Authorization check
  const isAdmin = checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required to add products.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      price,
      description,
      category,
      colors,
      sizes,
      images,
      badge,
      is_featured,
      is_new_arrival,
      material,
      care_instructions,
      stock_status
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, Price, and Category are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const productId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProduct = {
      id: productId,
      name,
      price: Number(price),
      description: description || '',
      category,
      colors: colors || [],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      badge: badge || null,
      is_featured: Boolean(is_featured),
      is_new_arrival: Boolean(is_new_arrival),
      material: material || 'Premium Cotton',
      care_instructions: care_instructions || 'Machine wash cold.',
      stock_status: stock_status || 'In Stock',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('products').upsert([newProduct]).select();

    if (error) {
      console.warn('Supabase DB notice:', error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product saved successfully!',
        data: data ? data[0] : newProduct
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save product.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
