'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface SimpleMapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

export default function SimpleMapPicker({ 
  latitude = -12.9714, 
  longitude = -38.5014, 
  onLocationSelect, 
  height = '400px' 
}: SimpleMapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  const handleCurrentLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          Use os controles para definir a localização
        </div>
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="btn-outline text-xs px-3 py-1"
        >
          Minha Localização
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-gray-100" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Mapa interativo será carregado aqui</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Latitude:</label>
                <input
                  type="number"
                  value={position[0]}
                  onChange={(e) => {
                    const lat = parseFloat(e.target.value);
                    if (!isNaN(lat)) {
                      handleLocationSelect(lat, position[1]);
                    }
                  }}
                  className="input text-sm w-32"
                  step="0.000001"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Longitude:</label>
                <input
                  type="number"
                  value={position[1]}
                  onChange={(e) => {
                    const lng = parseFloat(e.target.value);
                    if (!isNaN(lng)) {
                      handleLocationSelect(position[0], lng);
                    }
                  }}
                  className="input text-sm w-32"
                  step="0.000001"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        Latitude: {position[0].toFixed(6)} | Longitude: {position[1].toFixed(6)}
      </div>
    </div>
  );
}
