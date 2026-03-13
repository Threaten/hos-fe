import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tenant, API_URL } from "@/api/queries";

interface ShortAboutProps {
  tenant?: Tenant | null;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const fallbackImages = [
  "/media/IMG_0054.JPG",
  "/media/Artboard 11 copy 2@2x.PNG",
  "/media/IMG_0055.JPG",
  "/media/Artboard 11 copy 3@2x.PNG",
  "/media/IMG_0051.JPG",
  "/media/Artboard 11 copy 4@2x.PNG",
  "/media/IMG_0053.JPG",
];

const ShortAbout: React.FC<ShortAboutProps> = ({ tenant }) => {
  const title =
    tenant?.shortAboutTitle || "CRAFTING CULINARY EXCELLENCE WITH PASSION";
  const text =
    tenant?.shortAboutText ||
    "At Elementa, we believe dining is an art form. Each dish is thoughtfully prepared with the finest ingredients, blending traditional techniques with innovative flavors. Our intimate atmosphere and dedicated service create unforgettable moments that celebrate the essence of fine cuisine. Every visit tells a story of taste, elegance, and culinary mastery.";

  // Get images to use and randomize them
  let randomizedImages = fallbackImages;

  if (tenant?.shortAboutCollages && tenant.shortAboutCollages.length === 7) {
    const images = tenant.shortAboutCollages
      .filter((item) => item.image?.url)
      .map((item) => item.image!.url);

    if (images.length === 7) {
      randomizedImages = shuffleArray(images);
    }
  } else {
    randomizedImages = shuffleArray(fallbackImages);
  }

  return (
    <section className="w-full min-h-screen bg-background relative overflow-hidden py-16 px-8">
      {/* Background Images - Scattered Layout */}

      {/* Top Left - Mushroom Lamp */}
      <div className="absolute top-8 left-8 w-48 h-48 lg:w-60 lg:h-60 animate-float">
        <Image
          src={`${API_URL}${randomizedImages[0]}`}
          alt="Gourmet appetizer"
          width={240}
          height={240}
          className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Top Center - Floor Lamp */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 h-48 lg:w-96 lg:h-56">
        <Image
          src={`${API_URL}${randomizedImages[1]}`}
          alt="Grilled steak"
          width={384}
          height={224}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Top Right - Table Lamp */}
      <div className="absolute top-8 right-8 w-48 h-48 lg:w-60 lg:h-60 animate-float delay-300">
        <Image
          src={`${API_URL}${randomizedImages[2]}`}
          alt="Fresh pasta"
          width={240}
          height={240}
          className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Middle Left - Decorative Object */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-56 h-64 lg:w-72 lg:h-80">
        <Image
          src={`${API_URL}${randomizedImages[3]}`}
          alt="Fresh salad"
          width={288}
          height={320}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Bottom Right - Rattan Lamp */}
      <div className="absolute bottom-8 right-8 w-48 h-64 lg:w-60 lg:h-80">
        <Image
          src={`${API_URL}${randomizedImages[4]}`}
          alt="Chocolate dessert"
          width={240}
          height={320}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Bottom Left - Modern Chair */}
      <div className="absolute bottom-4 left-8 w-64 h-56 lg:w-80 lg:h-64">
        <Image
          src={`${API_URL}${randomizedImages[5]}`}
          alt="Grilled salmon"
          width={320}
          height={256}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Bottom Center - Decorative Mirror */}
      <div className="absolute bottom-8 left-1/2 transform translate-x-8 w-48 h-48 lg:w-60 lg:h-60">
        <Image
          src={`${API_URL}${randomizedImages[6]}`}
          alt="Artisan pizza"
          width={240}
          height={240}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Central Content Area */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="bg-background/20 backdrop-blur-sm rounded-2xl p-12 lg:p-16 max-w-2xl mx-auto text-center shadow-xl animate-scale-in">
          {/* Main Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight whitespace-pre-line">
            {title}
          </h2>

          {/* Description Text */}
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
            {text}
          </p>

          {/* Call to Action Button */}
          <Link
            href="/about"
            className="inline-block text-sm font-semibold text-gray-900 tracking-wider border-b border-gray-900 hover:border-gray-600 hover:text-gray-600 transition-all duration-300 pb-1"
          >
            READ ABOUT US
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShortAbout;
