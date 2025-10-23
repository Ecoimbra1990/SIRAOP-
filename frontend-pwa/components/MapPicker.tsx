'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix para ícones do Leaflet no Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function MapPicker({ 
  latitude = -12.9714, 
  longitude = -38.5014, 
  onLocationSelect, 
  height = '400px' 
}: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
          mapRef.current?.setView([lat, lng], 15);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Erro ao obter sua localização atual');
        }
      );
    } else {
      alert('Geolocalização não é suportada por este navegador');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          Clique no mapa para selecionar a localização
        </div>
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="btn-outline text-xs px-3 py-1"
        >
          Minha Localização
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden" style={{ height }}>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
      
      <div className="text-sm text-gray-500">
        Latitude: {position[0].toFixed(6)} | Longitude: {position[1].toFixed(6)}
      </div>
    </div>
  );
}
