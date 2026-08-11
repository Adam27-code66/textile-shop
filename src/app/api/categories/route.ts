import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role',
};

const DEFAULT_CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Hoodies',
  'Pants',
  'Jackets',
  'Dresses',
  'Sarees',
  'Kids Wear',
  'Accessories'
];

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error || !categories || categories.length === 0) {
      return NextResponse.json(
        { success: true, source: 'default', data: DEFAULT_CATEGORIES.map((c) => ({ id: c.toLowerCase(), name: c })) },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true, source: 'supabase', data: categories }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { success: true, source: 'default', data: DEFAULT_CATEGORIES.map((c) => ({ id: c.toLowerCase(), name: c })) },
      { headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required to manage categories.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const categoryId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      id: categoryId,
      name,
      slug: categoryId,
      description: description || ''
    };

    const { data, error } = await supabase.from('categories').upsert([newCategory]).select();

    return NextResponse.json(
      { success: true, message: 'Category added successfully!', data: data ? data[0] : newCategory },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
