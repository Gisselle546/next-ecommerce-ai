"use client";

import { useState, useEffect } from "react";

// Image arrays for left and right sides
const leftImages = ["/carousel/left-1.png", "/carousel/left-2.png"];

const rightImages = ["/carousel/right-1.png", "/carousel/right-2.png"];

export function HeroCarousel() {
  // Track which image is currently showing
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % leftImages.length);
    }, 5000);

    // Cleanup: stop timer when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Calculate previous index (for slide-out animation)
  const previousIndex =
    (currentIndex - 1 + leftImages.length) % leftImages.length;

  return (
    <div className="flex w-full h-[80vh] p-4">
      {/* LEFT SIDE - 50% */}
      <div className="relative w-1/2 h-full overflow-hidden bg-gray-900 rounded-l-2xl">
        {leftImages.map((image, index) => {
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
                src={image}
                alt={`Left ${index + 1}`}
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
                    Summer Collection
                  </h2>
                  <p className="text-body-lg mb-6">
                    Discover lightweight styles
                  </p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-full text-button-md font-semibold hover:bg-gray-100 transition-colors">
                    Shop Men
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDE - 50% */}
      <div className="relative w-1/2 h-full overflow-hidden bg-gray-800 rounded-r-2xl">
        {rightImages.map((image, index) => {
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
                src={image}
                alt={`Right ${index + 1}`}
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
                    Beach Ready
                  </h2>
                  <p className="text-body-lg mb-6">New swimwear collection</p>
                  <button className="bg-primary-600 text-white px-8 py-3 rounded-full text-button-md font-semibold hover:bg-primary-700 transition-colors">
                    Shop Women
                  </button>
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
