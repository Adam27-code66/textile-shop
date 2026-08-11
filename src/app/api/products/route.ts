import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';
import { dynamicProductsStore, addOrUpdateDynamicProduct } from '@/data/products';
import { Product } from '@/types/product';

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
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    let supabaseList: Product[] = [];

    if (!error && Array.isArray(dbProducts) && dbProducts.length > 0) {
      supabaseList = dbProducts.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description || '',
        category: item.category,
        colors: Array.isArray(item.colors) ? item.colors : [],
        sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
        badge: item.badge || undefined,
        isFeatured: Boolean(item.is_featured ?? item.isFeatured),
        isNewArrival: Boolean(item.is_new_arrival ?? item.isNewArrival),
        material: item.material,
        careInstructions: item.care_instructions || item.careInstructions,
        stockStatus: item.stock_status || item.stockStatus || 'In Stock'
      }));
    }

    // Merge Supabase items with in-memory dynamicProductsStore (Supabase taking priority)
    const mergedMap = new Map<string, Product>();

    dynamicProductsStore.forEach((p) => mergedMap.set(p.id, p));
    supabaseList.forEach((p) => mergedMap.set(p.id, p));

    const finalProducts = Array.from(mergedMap.values());

    return NextResponse.json(
      {
        success: true,
        source: supabaseList.length > 0 ? 'supabase' : 'dynamic',
        data: finalProducts
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: true, source: 'fallback', data: dynamicProductsStore },
      { headers: corsHeaders }
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
      material
    } = body;

    const isFeatured = body.is_featured ?? body.isFeatured ?? false;
    const isNewArrival = body.is_new_arrival ?? body.isNewArrival ?? false;
    const stockStatus = body.stock_status ?? body.stockStatus ?? 'In Stock';
    const careInstructions = body.care_instructions ?? body.careInstructions ?? 'Machine wash cold.';

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, Price, and Category are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const productId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const formattedProduct: Product = {
      id: productId,
      name,
      price: Number(price),
      description: description || '',
      category,
      colors: colors || [],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      badge: badge || undefined,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      material: material || '100% Premium Cotton',
      careInstructions,
      stockStatus
    };

    // 1. Immediately update in-memory dynamic store
    addOrUpdateDynamicProduct(formattedProduct);

    // 2. Insert into Supabase DB
    const dbPayload = {
      id: productId,
      name,
      price: Number(price),
      description: description || '',
      category,
      colors: colors || [],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      badge: badge || null,
      is_featured: Boolean(isFeatured),
      is_new_arrival: Boolean(isNewArrival),
      material: material || '100% Premium Cotton',
      care_instructions: careInstructions,
      stock_status: stockStatus,
      updated_at: new Date().toISOString()
    };

    const { error: dbError } = await supabase.from('products').upsert([dbPayload]);
    if (dbError) {
      console.warn('Supabase DB Notice (Using in-memory sync):', dbError.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product saved successfully!',
        data: formattedProduct
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
