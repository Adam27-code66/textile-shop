'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/product';
import { formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex gap-4 py-6 border-b border-white/[0.06]">
      {/* Image */}
      <Link href={`/products/${item.product.id}`} className="shrink-0">
        <div className="relative w-20 h-24 md:w-24 md:h-32 bg-[#13141B] overflow-hidden">
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${item.product.id}`}>
              <h3 className="text-sm font-medium text-white hover:text-[#B84DFF] transition-colors truncate">
                {item.product.name}
              </h3>
            </Link>
            <p className="text-xs text-[#A6A6B0] mt-1">
              {item.selectedSize} / {item.selectedColor.name}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.name)}
            className="p-1 text-[#A6A6B0] hover:text-[#E23DFF] transition-colors shrink-0"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          {/* Quantity */}
          <div className="flex items-center border border-white/[0.08]">
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selectedSize,
                  item.selectedColor.name,
                  item.quantity - 1
                )
              }
              disabled={item.quantity <= 1}
              className="p-2 text-[#A6A6B0] hover:text-white transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm font-medium text-white min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selectedSize,
                  item.selectedColor.name,
                  item.quantity + 1
                )
              }
              className="p-2 text-[#A6A6B0] hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <p className="text-sm font-semibold text-white">
            {formatPrice(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
