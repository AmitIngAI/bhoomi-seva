import { useState, useEffect } from "react";

function HeroCircle() {
  // Center Circle Images (auto-shift)
  const images = [
    {
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      caption: "Agricultural Land"
    },
    {
      url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      caption: "Property Documentation"
    },
    {
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
      caption: "Smart Land Records"
    }
  ];

  // Services around circle
  const services = [
    { name: "Land Records", angle: 270 },
    { name: "AI Prediction", angle: 315 },
    { name: "Search Records", angle: 0 },
    { name: "7/12", angle: 45 },
    { name: "8A", angle: 90 },
    { name: "GIS Maps", angle: 135 },
    { name: "My Documents", angle: 180 },
    { name: "Property Card", angle: 225 },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    const serviceInterval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 2000);
    return () => clearInterval(serviceInterval);
  }, []);

  const radius = 250;

  return (
    <div className="relative w-full flex items-center justify-center py-8">
      <div className="relative" style={{ width: "580px", height: "580px" }}>

        {/* Outer Rotating Rings */}
        <div
          className="absolute inset-0 rounded-full border-2 border-orange-300/40"
          style={{ animation: "rotate 30s linear infinite" }}
        />
        <div
          className="absolute inset-6 rounded-full border-2 border-orange-200/30"
          style={{ animation: "rotate 25s linear infinite reverse" }}
        />

        {/* Center Circle with Auto-Shifting Images */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full overflow-hidden shadow-2xl border-[6px] border-white">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0"
              style={{
                opacity: currentImage === idx ? 1 : 0,
                transition: "opacity 1.5s ease-in-out",
                backgroundImage: `url(${img.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          ))}

          {/* Caption at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
            <p className="text-white text-sm font-bold text-center drop-shadow-lg">
              {images[currentImage].caption}
            </p>
          </div>
        </div>

        {/* Service Labels Around Circle */}
        {services.map((service, idx) => {
          const angleRad = (service.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;
          const isActive = activeService === idx;

          return (
            <div
              key={idx}
              className={`absolute top-1/2 left-1/2 transition-all duration-500 ${
                isActive ? "scale-110 z-20" : "scale-100 z-10"
              }`}
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div
                className={`px-4 py-2.5 rounded-lg shadow-lg font-bold text-sm whitespace-nowrap transition-all duration-500 cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-white shadow-2xl shadow-orange-500/60"
                    : "bg-white text-navy-800 hover:bg-orange-50 hover:scale-105"
                }`}
              >
                {service.name}
              </div>
            </div>
          );
        })}

        {/* Center Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-3xl"
            style={{
              background: "radial-gradient(circle, #FF6B35 0%, transparent 70%)",
              animation: "glow 3s ease-in-out infinite"
            }}
          />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default HeroCircle;