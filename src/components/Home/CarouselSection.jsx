import { useState, useEffect } from 'react';
import Rank2 from '../../assets/Rank2.jpg';
import Rank5 from '../../assets/Rank5.png';
import Rank3 from '../../assets/Rank3.jpg';

const CarouselSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: Rank5,
      title: "Excellence in Engineering Education"
    },
    {
      url: Rank2,
      title: "Leading Arts & Science Institutions"
    },
    
    {
      url: Rank3,
      title: "Research & Innovation Centers"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-140 overflow-hidden">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          </div>
        ))}
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {heroImages[currentSlide].title}
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Discover India's leading educational institutions through our comprehensive ranking system
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-teal-400 w-8' : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default CarouselSection;