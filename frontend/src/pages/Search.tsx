import { useState } from 'react';
import { Search as SearchIcon, MapPin, Thermometer, Clock } from 'lucide-react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    { id: 'ladies-day', label: 'レディースデイあり', category: 'schedule' },
    { id: 'outdoor-bath', label: '外気浴', category: 'facility' },
    { id: 'loyly', label: 'ロウリュ', category: 'facility' },
    { id: 'high-temp', label: '高温サウナ（80度以上）', category: 'temperature' },
    { id: 'cold-bath', label: '水風呂（18度以下）', category: 'temperature' },
    { id: 'women-only', label: '女性専用エリア', category: 'facility' },
    { id: 'clean', label: '清潔度重視', category: 'quality' },
    { id: 'makeup-space', label: 'メイクルーム完備', category: 'amenity' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Mock search results
  const searchResults = [
    {
      id: '1',
      name: 'スカイスパYOKOHAMA',
      location: '横浜市西区',
      rating: 4.5,
      price: '2,750円',
      hasLadiesDay: true,
      tags: ['ロウリュ', '外気浴', '女性専用エリア'],
      nextLadiesDay: '毎週火曜日',
    },
    {
      id: '2',
      name: 'ラクーア',
      location: '東京都文京区',
      rating: 4.2,
      price: '2,900円',
      hasLadiesDay: true,
      tags: ['高温サウナ', '水風呂', 'メイクルーム'],
      nextLadiesDay: '毎日開催',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="地域、施設名で検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Filter Categories */}
      <div className="space-y-4">
        <h2 className="font-semibold">条件で絞り込み</h2>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">スケジュール</h3>
            <div className="flex flex-wrap gap-2">
              {filters.filter(f => f.category === 'schedule').map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">設備</h3>
            <div className="flex flex-wrap gap-2">
              {filters.filter(f => f.category === 'facility').map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">温度</h3>
            <div className="flex flex-wrap gap-2">
              {filters.filter(f => f.category === 'temperature').map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">女性向け設備</h3>
            <div className="flex flex-wrap gap-2">
              {filters.filter(f => f.category === 'amenity' || f.category === 'quality').map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {(searchQuery || selectedFilters.length > 0) && (
        <div className="space-y-3">
          <h2 className="font-semibold">検索結果 ({searchResults.length}件)</h2>
          
          {searchResults.map(result => (
            <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{result.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{result.location}</span>
                    <span>★{result.rating}</span>
                    <span>{result.price}</span>
                  </div>
                </div>
                
                {result.hasLadiesDay && (
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                    レディースデイあり
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">{result.nextLadiesDay}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {result.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button className="w-full bg-pink-50 text-pink-600 py-2 rounded-lg text-sm font-medium">
                詳細を見る
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!searchQuery && selectedFilters.length === 0 && (
        <div className="text-center py-8">
          <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">検索条件を入力してください</p>
        </div>
      )}
    </div>
  );
}