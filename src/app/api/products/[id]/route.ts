import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';
import { Product } from '@/types/product';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data: dbProduct, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !dbProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: mapDbToProduct(dbProduct) },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const isAdmin = checkAdminAuth(request);

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();

    const updatePayload: Record<string, any> = {};
    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.price !== undefined) updatePayload.price = Number(body.price);
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.colors !== undefined) updatePayload.colors = body.colors;
    if (body.sizes !== undefined) updatePayload.sizes = body.sizes;
    if (body.images !== undefined) updatePayload.images = body.images;
    if (body.badge !== undefined) updatePayload.badge = body.badge || null;
    if (body.material !== undefined) updatePayload.material = body.material;

    if (body.isFeatured !== undefined || body.is_featured !== undefined) {
      updatePayload.is_featured = Boolean(body.is_featured ?? body.isFeatured);
    }
    if (body.isNewArrival !== undefined || body.is_new_arrival !== undefined) {
      updatePayload.is_new_arrival = Boolean(body.is_new_arrival ?? body.isNewArrival);
    }
    if (body.careInstructions !== undefined || body.care_instructions !== undefined) {
      updatePayload.care_instructions = body.care_instructions ?? body.careInstructions;
    }
    if (body.stockStatus !== undefined || body.stock_status !== undefined) {
      updatePayload.stock_status = body.stock_status ?? body.stockStatus;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase UPDATE error:', error.message);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product updated!', data: data && data[0] ? mapDbToProduct(data[0]) : null },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update product.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const isAdmin = checkAdminAuth(request);

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error.message);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: `Product ${id} deleted.` },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete product.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
