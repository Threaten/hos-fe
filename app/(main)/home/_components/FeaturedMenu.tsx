import React from "react";
import Image from "next/image";
import SkeletonImage from "@/app/components/SkeletonImage";

interface FeaturedItem {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

const FeaturedMenu: React.FC = () => {
  const featuredItems: FeaturedItem[] = [
    {
      id: 1,
      name: "GRILLED SALMON",
      price: "700.000 VND",
      image:
        "https://images.unsplash.com/photo-1580554530778-ca36943938b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description:
        "Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter sauce. A house specialty.",
    },
    {
      id: 2,
      name: "BEEF TENDERLOIN",
      price: "900.000 VND",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description:
        "Premium beef tenderloin cooked to your preference, accompanied by truffle mashed potatoes and red wine reduction.",
    },
    {
      id: 3,
      name: "PASTA CARBONARA",
      price: "200.000 VND",
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description:
        "Traditional Italian pasta with crispy pancetta, parmesan cheese, and creamy egg sauce. Comfort food at its finest.",
    },
    {
      id: 4,
      name: "LOBSTER RISOTTO",
      price: "700.000 VND2",
      image:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description:
        "Creamy arborio risotto with fresh lobster, asparagus, and a hint of saffron. An elegant seafood delicacy.",
    },
  ];

  return (
    <section className="px-4">
      <div className="w-full mx-auto border-t border-b border-[rgb(124,118,89)]/30">
        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden transition-all duration-500 px-4 py-8 hover:bg-background/50 ${
                index !== 0 ? "border-l border-[rgb(124,118,89)]/30" : ""
              }`}
            >
              {/* Image Container */}
              <div className="relative w-full h-64 overflow-hidden bg-white p-4 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                <SkeletonImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Description Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                  <p className="text-white text-center text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Item Details */}
              <div className="px-2 mt-4 transition-all duration-300 group-hover:mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-normal tracking-wide uppercase group-hover:text-gray-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-sm font-semibold group-hover:text-gray-600 transition-colors duration-300">
                    {item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
