"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Left side carousel data
const leftSlides = [
  {
    image: "/carousel/left-1.png",
    title: "Summer Jeans Collection",
    description: "Discover lightweight styles",
    buttonText: "Shop Women",
    link: "/categories/women",
  },
  {
    image: "/carousel/left-2.png",
    title: "Business Essentials",
    description: "Business styles for the modern professional",
    buttonText: "Explore Women",
    link: "/categories/women",
  },
];

// Right side carousel data
const rightSlides = [
  {
    image: "/carousel/right-1.png",
    title: "Comfortable Jeans",
    description: "New jeans collection",
    buttonText: "Shop Men",
    link: "/categories/men",
  },
  {
    image: "/carousel/right-2.png",
    title: "Stylish Weekend Wear",
    description: "Fresh prints for the Weekend",
    buttonText: "Explore Men",
    link: "/categories/men",
  },
];

export function HeroCarousel() {
  // Track which image is currently showing
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % leftSlides.length);
    }, 5000);

    // Cleanup: stop timer when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Calculate previous index (for slide-out animation)
  const previousIndex =
    (currentIndex - 1 + leftSlides.length) % leftSlides.length;

  return (
    <div className="flex w-full h-[80vh] p-4">
      {/* LEFT SIDE - 50% */}
      <div className="relative w-1/2 h-full overflow-hidden bg-gray-900 rounded-l-2xl">
        {leftSlides.map((slide, index) => {
          // Determine this image's state
          const isCurrent = index === currentIndex;
          const isPrevious = index === previousIndex;

          // Set position based on state
          let positionClass = "translate-y-full"; // Default: below viewport

          if (isCurrent) {
            positionClass = "translate-y-0"; // Current: visible
          } else if (isPrevious) {
            positionClass = "-translate-y-full"; // Previous: slide up
          }

          return (
            <div
              key={index}
              className={`
                absolute inset-0 w-full h-full
                transition-transform duration-1000 ease-in-out
                ${positionClass}
              `}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image not found
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
                }}
              />
              {/* Overlay with text */}
              <div className="absolute inset-0 bg-linear-to-br from-black/40 to-transparent flex items-center justify-center">
                <div className="text-center text-white px-8">
                  <h2 className="text-display-lg mb-4 font-bold">
                    {slide.title}
                  </h2>
                  <p className="text-body-lg mb-6">{slide.description}</p>
                  <Link
                    href={slide.link}
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full text-button-md font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDE - 50% */}
      <div className="relative w-1/2 h-full overflow-hidden bg-gray-800 rounded-r-2xl">
        {rightSlides.map((slide, index) => {
          const isCurrent = index === currentIndex;
          const isPrevious = index === previousIndex;

          let positionClass = "translate-y-full";

          if (isCurrent) {
            positionClass = "translate-y-0";
          } else if (isPrevious) {
            positionClass = "-translate-y-full";
          }

          return (
            <div
              key={index}
              className={`
                absolute inset-0 w-full h-full
                transition-transform duration-1000 ease-in-out
                ${positionClass}
              `}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image not found
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.style.background = `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`;
                }}
              />
              {/* Overlay with text */}
              <div className="absolute inset-0 bg-linear-to-bl from-black/40 to-transparent flex items-center justify-center">
                <div className="text-center text-white px-8">
                  <h2 className="text-display-lg mb-4 font-bold">
                    {slide.title}
                  </h2>
                  <p className="text-body-lg mb-6">{slide.description}</p>
                  <Link
                    href={slide.link}
                    className="inline-block bg-primary-600 text-white px-8 py-3 rounded-full text-button-md font-semibold hover:bg-primary-700 transition-colors"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Indicator */}
    </div>
  );
}
