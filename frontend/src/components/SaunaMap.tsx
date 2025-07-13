import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const saunaIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ladiesDayIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNFQzQ4OTkiLz4KPHA+dGggZD0iTTEyLjUgMjVMMTIuNSA0MSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==',
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNFQzQ4OTkiLz4KPHA+dGggZD0iTTEyLjUgMjVMMTIuNSA0MSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Sauna {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  priceRange: string;
  hasLadiesDay?: boolean;
  distance?: number;
}

interface SaunaMapProps {
  saunas: Sauna[];
  center?: [number, number];
  zoom?: number;
  onSaunaClick?: (sauna: Sauna) => void;
  className?: string;
}

// Component to handle map center updates
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function SaunaMap({ 
  saunas, 
  center = [35.6762, 139.6503], // Default to Tokyo
  zoom = 12,
  onSaunaClick,
  className = "h-64 w-full rounded-lg"
}: SaunaMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const mapCenter = userLocation || center;

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapCenterController center={mapCenter} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={new L.Icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0iIzM5OEVGNyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjMiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
              popupAnchor: [0, -10],
            })}
          >
            <Popup>現在地</Popup>
          </Marker>
        )}
        
        {/* Sauna markers */}
        {saunas.map((sauna) => (
          <Marker
            key={sauna.id}
            position={[sauna.latitude, sauna.longitude]}
            icon={sauna.hasLadiesDay ? ladiesDayIcon : saunaIcon}
            eventHandlers={{
              click: () => onSaunaClick?.(sauna)
            }}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold text-gray-900 mb-1">{sauna.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{sauna.address}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">★ {sauna.rating}</span>
                  <span className="text-gray-700">{sauna.priceRange}</span>
                </div>
                {sauna.hasLadiesDay && (
                  <div className="mt-2">
                    <span className="inline-block bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded">
                      レディースデイあり
                    </span>
                  </div>
                )}
                {sauna.distance && (
                  <div className="mt-1 text-xs text-gray-500">
                    約 {sauna.distance.toFixed(1)}km
                  </div>
                )}
                <button
                  onClick={() => onSaunaClick?.(sauna)}
                  className="mt-2 w-full bg-pink-500 text-white text-sm py-1 px-2 rounded hover:bg-pink-600"
                >
                  詳細を見る
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}