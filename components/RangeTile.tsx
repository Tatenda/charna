import { useTapPreviewNavigation } from '@/hooks/useTapPreviewNavigation';
import Link from 'next/link';

interface RangeTileProps {
  href: string;
  defaultImage: string;
  hoverImage: string;
  defaultAlt: string;
  hoverAlt: string;
  title: string;
  description: string;
  price: string;
  onAddToCart: () => void;
  addToCartText?: string;
  testId?: string;
  children?: React.ReactNode;
}

export const RangeTile = ({
  href,
  defaultImage,
  hoverImage,
  defaultAlt,
  hoverAlt,
  title,
  description,
  price,
  onAddToCart,
  addToCartText = "Add to Cart",
  testId,
  children
}: RangeTileProps) => {
  const { previewActive, isTouchDevice, handleTileClick, tileRef } = useTapPreviewNavigation();

  // Determine if we should show the hover state
  const showHoverState = previewActive;

  return (
    <Link
      ref={tileRef}
      href={href}
      className="group cursor-pointer block"
      onClick={(e) => {
        if (isTouchDevice) {
          handleTileClick(e, href);
        }
        // On non-touch devices, allow normal navigation
      }}
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        {/* Default image */}
        <img 
          src={defaultImage}
          alt={defaultAlt}
          className={`w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${
            isTouchDevice 
              ? (showHoverState ? 'opacity-0' : 'opacity-100')
              : 'group-hover:opacity-0'
          }`}
          style={{ imageRendering: 'auto' }}
        />
        
        {/* Hover image */}
        <img 
          src={hoverImage}
          alt={hoverAlt}
          className={`absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${
            isTouchDevice 
              ? (showHoverState ? 'opacity-100' : 'opacity-0')
              : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ imageRendering: 'auto' }}
        />

        {/* Add to Cart button overlay */}
        <div className={`absolute bottom-4 left-4 right-4 transition-opacity duration-300 ${
          isTouchDevice 
            ? (showHoverState ? 'opacity-100' : 'opacity-0')
            : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button 
            className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            data-testid={testId}
          >
            {addToCartText}
          </button>
        </div>

        {/* Touch preview hint */}
        {isTouchDevice && showHoverState && (
          <div className="absolute top-4 left-4 right-4 opacity-90 z-20">
            <div className="bg-black/70 text-white text-xs py-1 px-2 rounded text-center">
              Tap again to open
            </div>
          </div>
        )}
      </div>
      
      <h3 className="text-lg text-botanical mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-2">{description}</p>
      <p className="font-bold text-black">{price}</p>
      
      {children}
    </Link>
  );
};