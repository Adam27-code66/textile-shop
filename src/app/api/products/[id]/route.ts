import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';
import { dynamicProductsStore, addOrUpdateDynamicProduct, deleteDynamicProduct } from '@/data/products';
import { Product } from '@/types/product';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existingMemory = dynamicProductsStore.find((p) => p.id === id);

    const { data: dbProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (dbProduct) {
      const formatted: Product = {
        id: dbProduct.id,
        name: dbProduct.name,
        price: Number(dbProduct.price),
        description: dbProduct.description || '',
        category: dbProduct.category,
        colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : [],
        sizes: Array.isArray(dbProduct.sizes) ? dbProduct.sizes : ['S', 'M', 'L', 'XL'],
        images: Array.isArray(dbProduct.images) && dbProduct.images.length > 0 ? dbProduct.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
        badge: dbProduct.badge || undefined,
        isFeatured: Boolean(dbProduct.is_featured ?? dbProduct.isFeatured),
        isNewArrival: Boolean(dbProduct.is_new_arrival ?? dbProduct.isNewArrival),
        material: dbProduct.material,
        careInstructions: dbProduct.care_instructions || dbProduct.careInstructions,
        stockStatus: dbProduct.stock_status || dbProduct.stockStatus || 'In Stock'
      };
      return NextResponse.json({ success: true, data: formatted }, { headers: corsHeaders });
    }

    if (existingMemory) {
      return NextResponse.json({ success: true, data: existingMemory }, { headers: corsHeaders });
    }

    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404, headers: corsHeaders }
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
      { success: false, error: 'Unauthorized: Admin privileges required to update products.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    const existing = dynamicProductsStore.find((p) => p.id === id);

    const isFeatured = body.is_featured ?? body.isFeatured ?? existing?.isFeatured ?? false;
    const isNewArrival = body.is_new_arrival ?? body.isNewArrival ?? existing?.isNewArrival ?? false;
    const stockStatus = body.stock_status ?? body.stockStatus ?? existing?.stockStatus ?? 'In Stock';
    const careInstructions = body.care_instructions ?? body.careInstructions ?? existing?.careInstructions ?? '';

    const formattedUpdated: Product = {
      id,
      name: body.name || existing?.name || 'Apparel Item',
      price: Number(body.price || existing?.price || 999),
      description: body.description ?? existing?.description ?? '',
      category: body.category || existing?.category || 'Shirts',
      colors: body.colors || existing?.colors || [],
      sizes: body.sizes || existing?.sizes || ['S', 'M', 'L', 'XL'],
      images: body.images || existing?.images || ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      badge: body.badge ?? existing?.badge,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      material: body.material ?? existing?.material,
      careInstructions,
      stockStatus
    };

    // 1. Update in-memory store
    addOrUpdateDynamicProduct(formattedUpdated);

    // 2. Update Supabase DB with standard columns
    const dbPayload = {
      id,
      name: formattedUpdated.name,
      price: formattedUpdated.price,
      description: formattedUpdated.description,
      category: formattedUpdated.category,
      colors: formattedUpdated.colors,
      sizes: formattedUpdated.sizes,
      images: formattedUpdated.images,
      badge: formattedUpdated.badge || null,
      is_featured: formattedUpdated.isFeatured,
      is_new_arrival: formattedUpdated.isNewArrival,
      material: formattedUpdated.material || '100% Premium Cotton',
      care_instructions: formattedUpdated.careInstructions
    };

    const { error: dbError } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id);

    if (dbError) {
      console.warn('Supabase DB Update notice:', dbError.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product updated successfully!',
        data: formattedUpdated
      },
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
      { success: false, error: 'Unauthorized: Admin privileges required to delete products.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    deleteDynamicProduct(id);

    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.warn('Supabase DB Delete notice:', dbError.message);
    }

    return NextResponse.json(
      { success: true, message: `Product ${id} deleted successfully.` },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete product.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
