import React, { useRef, useEffect, useState } from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let step = 1; 
    let requestId;

    const scrollStep = () => {
      if (scrollContainer && !isPaused) {
        scrollContainer.scrollLeft += step;

        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      requestId = requestAnimationFrame(scrollStep);
    };
    requestId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(requestId);
  }, [isPaused]);

  // Duplicate items for seamless infinite scroll
  const loopCategories = [...categories, ...categories];

  return (
    <div className="mt-16 relative">
      <p className="text-2xl md:text-3xl font-medium mb-6">Categories</p>

      <div ref={scrollRef} className="flex gap-6 overflow-hidden" style={{ scrollBehavior: "smooth" }} onMouseEnter={() => setIsPaused(true)}  // pause on hover
        onMouseLeave={() => setIsPaused(false)} // resume on leave
      >
        {
        loopCategories.map((category, index) => (
            <div
                key={index}
                className="flex-none w-64 rounded-2xl overflow-hidden cursor-pointer"
                style={{ backgroundColor: category.bgColor }}
                onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0, 0);
                }}
            >
            <img src={category.image} alt={category.text} className="h-48 w-full object-contain p-3"/>
            <div className="p-4">
              <h5 className="text-lg font-semibold">{category.text}</h5>
              <p className="text-sm">
                {category.info}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
