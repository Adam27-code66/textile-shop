import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';
import { products as hardcodedProducts } from '@/data/products';
import { Product } from '@/types/product';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

function mapDbToProduct(item: any): Product {
  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    description: item.description || '',
    category: item.category,
    colors: Array.isArray(item.colors) ? item.colors : [],
    sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
    images: Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    badge: item.badge || undefined,
    isFeatured: Boolean(item.is_featured ?? item.isFeatured),
    isNewArrival: Boolean(item.is_new_arrival ?? item.isNewArrival),
    material: item.material,
    careInstructions: item.care_instructions || item.careInstructions,
    stockStatus: item.stock_status || item.stockStatus || 'In Stock',
  };
}

function productToDb(p: Partial<Product> & { id: string; name: string; price: number; category: string }) {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    description: p.description || '',
    category: p.category,
    colors: p.colors || [],
    sizes: p.sizes || ['S', 'M', 'L', 'XL'],
    images: p.images && p.images.length > 0
      ? p.images
      : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    badge: p.badge || null,
    is_featured: Boolean(p.isFeatured),
    is_new_arrival: Boolean(p.isNewArrival),
    material: p.material || '100% Premium Cotton',
    care_instructions: p.careInstructions || 'Machine wash cold.',
    stock_status: p.stockStatus || 'In Stock',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(dbProducts) && dbProducts.length > 0) {
      const products = dbProducts.map(mapDbToProduct);
      return NextResponse.json(
        { success: true, source: 'supabase', data: products },
        { headers: corsHeaders }
      );
    }

    // Fallback to hardcoded products if DB is empty or errored
    return NextResponse.json(
      { success: true, source: 'fallback', data: hardcodedProducts },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: true, source: 'fallback', data: hardcodedProducts },
      { headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name, Price, and Category are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const productId = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product: Product = {
      id: productId,
      name: body.name,
      price: Number(body.price),
      description: body.description || '',
      category: body.category,
      colors: body.colors || [],
      sizes: body.sizes || ['S', 'M', 'L', 'XL'],
      images: body.images && body.images.length > 0
        ? body.images
        : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      badge: body.badge || undefined,
      isFeatured: Boolean(body.is_featured ?? body.isFeatured),
      isNewArrival: Boolean(body.is_new_arrival ?? body.isNewArrival),
      material: body.material || '100% Premium Cotton',
      careInstructions: body.care_instructions ?? body.careInstructions ?? 'Machine wash cold.',
      stockStatus: body.stock_status ?? body.stockStatus ?? 'In Stock',
    };

    const dbPayload = productToDb(product);

    const { data, error } = await supabase
      .from('products')
      .upsert([dbPayload])
      .select();

    if (error) {
      console.error('Supabase INSERT error:', error.message);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product saved!', data: data ? mapDbToProduct(data[0]) : product },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save product.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
