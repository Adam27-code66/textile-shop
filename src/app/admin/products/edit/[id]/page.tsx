'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Upload, ArrowLeft, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { Size, ProductColor } from '@/types/product';

const AVAILABLE_SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const { products, updateProduct, categories } = useProducts();

  const existingProduct = products.find((p) => p.id === productId);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Shirts');
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock' | 'Low Stock'>('In Stock');
  const [imageUrl, setImageUrl] = useState('');
  const [material, setMaterial] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [badge, setBadge] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState<Size[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#8B3DFF');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Populate form with existing product details
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setPrice(existingProduct.price.toString());
      setCategory(existingProduct.category);
      setDescription(existingProduct.description || '');
      setStockStatus(existingProduct.stockStatus || 'In Stock');
      setImageUrl(existingProduct.images[0] || '');
      setMaterial(existingProduct.material || '100% Cotton');
      setCareInstructions(existingProduct.careInstructions || 'Machine wash cold.');
      setBadge(existingProduct.badge || '');
      setIsFeatured(Boolean(existingProduct.isFeatured));
      setIsNewArrival(Boolean(existingProduct.isNewArrival));
      setSelectedSizes(existingProduct.sizes || ['S', 'M', 'L', 'XL']);
      setColors(existingProduct.colors || []);
    }
  }, [existingProduct]);

  if (!existingProduct) {
    return (
      <div className="p-12 text-center text-white">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <p className="text-xs text-[#A6A6B0] mt-2">The item with ID &quot;{productId}&quot; could not be located.</p>
        <Link href="/admin/products" className="inline-block mt-4 text-xs text-[#B84DFF] underline">
          Return to Products List
        </Link>
      </div>
    );
  }

  const toggleSize = (size: Size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-user-role': 'ADMIN' },
        body: formData
      });

      const json = await res.json();
      if (json.success && json.url) {
        setImageUrl(json.url);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Upload fallback applied');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !price || !category) {
      setErrorMessage('Product Name, Price, and Category are required.');
      return;
    }

    setIsSubmitting(true);

    const finalImage = imageUrl.trim() || existingProduct.images[0];

    const result = await updateProduct(productId, {
      name: name.trim(),
      price: Number(price),
      category,
      description: description.trim(),
      stockStatus,
      images: [finalImage],
      sizes: selectedSizes,
      colors: colors.length > 0 ? colors : existingProduct.colors,
      material,
      careInstructions,
      badge: badge || undefined,
      isFeatured,
      isNewArrival
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Product updated successfully! Customer catalog has been updated.');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } else {
      setErrorMessage(result.error || 'Failed to update product.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-xs text-[#A6A6B0] hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Products List
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Product: {existingProduct.name}</h1>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#0D0E13] border border-white/[0.08] p-6 md:p-8 rounded-xl space-y-6 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#13141B] border border-white/[0.08] py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg cursor-pointer"
            >
              {categories.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat} className="bg-[#13141B] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Stock Availability Status *
            </label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="w-full bg-[#13141B] border border-white/[0.08] py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg cursor-pointer"
            >
              <option value="In Stock">In Stock (Available for Purchase)</option>
              <option value="Out of Stock">Out of Stock (Shows Out of Stock Badge)</option>
              <option value="Low Stock">Low Stock (Limited Quantity)</option>
            </select>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Product Badge (Optional)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Bestseller, Luxury, New"
              className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Product Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] p-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
            />
          </div>

          {/* Image Upload / URL */}
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white">
              Product Image
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-[#A6A6B0] mb-1.5">Replace File Image</p>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] hover:border-[#8B3DFF]/60 bg-white/[0.02] p-6 rounded-lg cursor-pointer transition-colors">
                  <Upload size={24} className="text-[#8B3DFF] mb-2" />
                  <span className="text-xs text-white font-medium">
                    {isUploading ? 'Uploading Image...' : 'Click to Upload Replacement Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div>
                <p className="text-[11px] text-[#A6A6B0] mb-1.5">Image URL</p>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
                />

                {imageUrl && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <img src={imageUrl} alt="Preview" className="w-12 h-16 object-cover rounded bg-[#13141B]" />
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <ImageIcon size={14} /> Active Image Preview
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#8B3DFF] text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]'
                        : 'bg-white/[0.04] border border-white/[0.08] text-[#A6A6B0] hover:text-white'
                    }`}
                  >
                    {size} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white">
              Color Swatches
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                  <span className="text-white font-medium">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-[#A6A6B0] hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 max-w-md">
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="New Color Name"
                className="flex-1 bg-white/[0.04] border border-white/[0.08] py-2 px-3 text-xs text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] rounded-lg"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-9 p-0.5 bg-transparent border border-white/[0.08] rounded cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-2 bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Material & Care */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Material / Fabric
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Care Instructions
            </label>
            <input
              type="text"
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
            />
          </div>

          {/* Flags */}
          <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#8B3DFF] rounded"
              />
              Show on Homepage Featured Collection
            </label>

            <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 accent-[#8B3DFF] rounded"
              />
              Mark as New Arrival Drop
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.06]">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_25px_rgba(139,61,255,0.4)] hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? 'Saving Changes...' : 'Save Product Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
