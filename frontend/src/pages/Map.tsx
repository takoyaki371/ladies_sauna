import { useState, useEffect } from 'react';
import { MapPin, Filter, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SaunaMap from '../components/SaunaMap';
import { useSaunas } from '../hooks/useSaunas';

export default function Map() {
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [filters, setFilters] = useState({
    hasLadiesDay: false,
    highRating: false,
    nearbyOnly: false
  });
  
  const navigate = useNavigate();
  
  // Get saunas based on user location and filters
  const searchParams = {
    ...(userLocation && { lat: userLocation[0], lng: userLocation[1] }),
    ...(filters.hasLadiesDay && { hasLadiesDay: true }),
    ...(filters.nearbyOnly && userLocation && { radius: 3 }),
    limit: 50
  };
  
  const { saunas, isLoading, error } = useSaunas(searchParams);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Tokyo if geolocation fails
          setUserLocation([35.6762, 139.6503]);
        }
      );
    } else {
      // Default to Tokyo if geolocation is not available
      setUserLocation([35.6762, 139.6503]);
    }
  }, []);

  const toggleFilter = (filterKey: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const handleSaunaClick = (sauna: any) => {
    navigate(`/sauna/${sauna.id}`);
  };

  // Transform saunas data for map component
  const mapSaunas = saunas.map(sauna => ({
    ...sauna,
    hasLadiesDay: false // Simplified for now
  }));

  const filteredSaunas = filters.highRating 
    ? mapSaunas.filter(sauna => (sauna.rating || 0) >= 4.0)
    : mapSaunas;

  return (
    <div className="h-full">
      {/* Map Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">サウナマップ</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">フィルター</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => toggleFilter('hasLadiesDay')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.hasLadiesDay 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                レディースデイあり
              </button>
              <button 
                onClick={() => toggleFilter('highRating')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.highRating 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                高評価のみ
              </button>
              <button 
                onClick={() => toggleFilter('nearbyOnly')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.nearbyOnly 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                3km以内
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      {userLocation ? (
        <SaunaMap
          saunas={filteredSaunas as any}
          center={userLocation}
          zoom={13}
          onSaunaClick={handleSaunaClick}
          className="h-64"
        />
      ) : (
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">位置情報を取得中...</p>
          </div>
        </div>
      )}

      {/* Spa List */}
      <div className="flex-1 bg-white">
        <div className="p-4 border-b">
          <h2 className="font-semibold">近くのサウナ施設</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500">エラーが発生しました</div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredSaunas.map(sauna => (
              <div key={sauna.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium">{sauna.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {sauna.distance && (
                        <span className="text-sm text-gray-500">
                          {sauna.distance.toFixed(1)}km
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{sauna.rating}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{sauna.priceRange}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {sauna.hasLadiesDay ? (
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                        レディースデイあり
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        レディースデイなし
                      </span>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSaunaClick(sauna)}
                  className="w-full bg-pink-50 text-pink-600 py-2 rounded-lg text-sm font-medium mt-3 hover:bg-pink-100"
                >
                  詳細を見る
                </button>
              </div>
            ))}
            
            {filteredSaunas.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-500">条件に一致するサウナが見つかりませんでした</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}