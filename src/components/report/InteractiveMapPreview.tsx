
import { useEffect, useRef, useState } from "react";

interface InteractiveMapPreviewProps {
  location: { lat: number; lng: number } | null;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

const InteractiveMapPreview = ({ location, onLocationSelect }: InteractiveMapPreviewProps) => {
  const [selectedLocation, setSelectedLocation] = useState(location);
  
  // Xanthi, Greece coordinates
  const xanthiCenter = { lat: 41.1354, lng: 24.8882 };
  
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onLocationSelect) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to coordinates around Xanthi
    const lat = xanthiCenter.lat + (y - rect.height / 2) * 0.0005;
    const lng = xanthiCenter.lng + (x - rect.width / 2) * 0.0008;
    
    const newLocation = { lat, lng };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  };

  useEffect(() => {
    setSelectedLocation(location);
  }, [location]);

  return (
    <div className="w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
      <div 
        className="w-full h-full relative cursor-pointer"
        onClick={handleMapClick}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Map overlay with grid pattern to simulate streets */}
        <div className="absolute inset-0 bg-green-100/70">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Grid pattern representing streets */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4ade80" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
            
            {/* Main roads */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="#059669" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#059669" strokeWidth="2" />
            
            {/* Landmark indicators */}
            <circle cx="200" cy="100" r="4" fill="#dc2626" />
            <text x="205" y="105" fontSize="10" fill="#dc2626">Κέντρο</text>
            
            <circle cx="150" cy="200" r="3" fill="#2563eb" />
            <text x="155" y="205" fontSize="8" fill="#2563eb">Πάρκο</text>
            
            <circle cx="300" cy="120" r="3" fill="#7c3aed" />
            <text x="305" y="125" fontSize="8" fill="#7c3aed">Νοσοκομείο</text>
          </svg>
        </div>
        
        {/* Selected location marker */}
        {selectedLocation && (
          <div 
            className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2 border-2 border-white shadow-lg"
            style={{
              left: `${50 + (selectedLocation.lng - xanthiCenter.lng) * 1250}%`,
              top: `${50 - (selectedLocation.lat - xanthiCenter.lat) * 2000}%`
            }}
          />
        )}
        
        {/* Info overlay */}
        <div className="absolute top-2 left-2 bg-white/90 p-2 rounded shadow text-xs">
          <div className="font-semibold">Ξάνθη, Ελλάδα</div>
          {selectedLocation && (
            <div className="mt-1">
              Lat: {selectedLocation.lat.toFixed(4)}<br/>
              Lng: {selectedLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-xs text-center">
          Κάντε κλικ στον χάρτη για να επιλέξετε την τοποθεσία
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPreview;
