import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const isAdmin = checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin privileges required to upload images.' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;

    if (imageUrlInput && imageUrlInput.startsWith('http')) {
      return NextResponse.json(
        { success: true, url: imageUrlInput },
        { headers: corsHeaders }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Try Supabase Storage upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      // Fallback base64 / data URL or Unsplash mockup image
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type || 'image/png'};base64,${base64}`;
      return NextResponse.json(
        { success: true, url: dataUrl, notice: 'Stored as data URI.' },
        { headers: corsHeaders }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return NextResponse.json(
      { success: true, url: publicUrlData.publicUrl },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Image upload failed.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
