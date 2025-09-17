import { useState } from "react";
import { getImagePath } from "@/lib/imageUtils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const maxThumbnails = 3;
  const hasMoreImages = images.length > maxThumbnails;

  return (
    <div className="relative">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img 
          src={getImagePath(mainImage)}
          alt={name}
          className="w-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {images.slice(0, maxThumbnails).map((image, index) => (
          <img 
            key={index}
            src={getImagePath(image)}
            alt={`${name} - Angle ${index + 1}`}
            className={`rounded-md cursor-pointer shadow hover:shadow-md ${mainImage === image ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setMainImage(image)}
            style={{ imageRendering: 'auto' }}
          />
        ))}
        {hasMoreImages && (
          <div 
            className="rounded-md cursor-pointer shadow hover:shadow-md bg-secondary flex items-center justify-center"
            onClick={() => setMainImage(images[maxThumbnails])}
          >
            <span className="text-primary-dark">+{images.length - maxThumbnails}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
