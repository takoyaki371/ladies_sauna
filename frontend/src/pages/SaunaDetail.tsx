import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, Clock, Star, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// サウナ詳細の型定義
interface SaunaDetail {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  facilities: Array<{
    id: string;
    name: string;
    category: string;
    isWomenOnly: boolean;
  }>;
  ladiesDays: Array<{
    id: string;
    dayOfWeek: number | null;
    specificDate: string | null;
    startTime?: string;
    endTime?: string;
    isOfficial: boolean;
    trustScore: number;
    supportCount: number;
    oppositionCount: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    visitDate: string;
    createdAt: string;
    user: {
      username: string;
    };
  }>;
}

const SaunaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [sauna, setSauna] = useState<SaunaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'ladies-days'>('overview');

  // 曜日名の変換
  const getDayName = (dayOfWeek: number) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[dayOfWeek];
  };

  // テストデータ（本格実装時はAPIから取得）
  useEffect(() => {
    if (id) {
      // APIからサウナ詳細を取得する処理
      // 現在はテストデータを使用
      setTimeout(() => {
        // IDに応じて異なるデータを返す
        const saunaData = id === 'test-sauna-id' ? {
          id: 'test-sauna-id',
          name: 'テストサウナ',
          address: '東京都渋谷区テスト1-1-1',
          latitude: 35.6762,
          longitude: 139.6503,
          phone: '03-1234-5678',
          website: 'https://example.com',
          description: 'テスト用のサウナです。女性専用時間もあり、清潔で居心地の良い施設です。',
          priceRange: '1000-2000円',
          rating: 4.5,
          reviewCount: 10,
          facilities: [
            { id: '1', name: 'ドライサウナ', category: 'SAUNA', isWomenOnly: false },
            { id: '2', name: '水風呂', category: 'BATH', isWomenOnly: false },
            { id: '3', name: '外気浴エリア', category: 'AMENITY', isWomenOnly: false },
          ],
          ladiesDays: [
            {
              id: 'test-ladies-day-id',
              dayOfWeek: 0,
              specificDate: null,
              startTime: '10:00',
              endTime: '16:00',
              isOfficial: true,
              trustScore: 4.5,
              supportCount: 8,
              oppositionCount: 1,
            }
          ],
          reviews: [
            {
              id: '1',
              rating: 5,
              title: '最高のサウナ体験',
              content: '設備が充実していて、女性専用時間もあるので安心して利用できます。',
              visitDate: '2025-07-15',
              createdAt: '2025-07-16T10:00:00Z',
              user: { username: 'saunaUser1' }
            }
          ]
        } : {
          // 汎用サウナデータ
          id: id,
          name: `サウナ ${id}`,
          address: '住所情報',
          latitude: 35.6762,
          longitude: 139.6503,
          phone: '03-0000-0000',
          website: 'https://example.com',
          description: 'サウナの詳細情報。',
          priceRange: '料金未設定',
          rating: 3.5,
          reviewCount: 0,
          facilities: [
            { id: '1', name: 'サウナ', category: 'SAUNA', isWomenOnly: false },
          ],
          ladiesDays: [],
          reviews: []
        };

        setSauna(saunaData);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/sauna/${id}/write-review`);
  };

  const handleAddLadiesDay = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/sauna/${id}/add-ladies-day`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!sauna) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">サウナが見つかりません</h2>
          <button 
            onClick={() => navigate('/search')}
            className="text-pink-600 hover:text-pink-700"
          >
            検索に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 mb-2"
          >
            ← 戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{sauna.name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{sauna.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({sauna.reviewCount}件)</span>
            </div>
            <span className="ml-4 text-sm text-gray-600">{sauna.priceRange}</span>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <button
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'text-pink-600 border-pink-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              概要
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
                activeTab === 'reviews'
                  ? 'text-pink-600 border-pink-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              レビュー
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
                activeTab === 'ladies-days'
                  ? 'text-pink-600 border-pink-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('ladies-days')}
            >
              レディースデー
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3">基本情報</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <span className="text-gray-700">{sauna.address}</span>
                </div>
                {sauna.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{sauna.phone}</span>
                  </div>
                )}
                {sauna.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <a 
                      href={sauna.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      公式サイト
                    </a>
                  </div>
                )}
              </div>
              {sauna.description && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">説明</h4>
                  <p className="text-gray-700 text-sm">{sauna.description}</p>
                </div>
              )}
            </div>

            {/* 設備情報 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3">設備</h3>
              <div className="grid grid-cols-2 gap-2">
                {sauna.facilities.map((facility) => (
                  <div 
                    key={facility.id}
                    className={`p-3 rounded-lg border text-sm ${
                      facility.isWomenOnly
                        ? 'bg-pink-50 border-pink-200 text-pink-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {facility.name}
                    {facility.isWomenOnly && (
                      <span className="block text-xs text-pink-600 mt-1">女性専用</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            {/* レビュー投稿ボタン */}
            <button
              onClick={handleWriteReview}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              {isAuthenticated ? 'レビューを投稿' : 'ログインしてレビューを投稿'}
            </button>

            {/* レビュー一覧 */}
            <div className="space-y-4">
              {sauna.reviews.length > 0 ? (
                sauna.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium">{review.user.username}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                    <p className="text-gray-700 text-sm">{review.content}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      訪問日: {new Date(review.visitDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだレビューがありません
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'ladies-days' && (
          <>
            {/* レディースデー追加ボタン */}
            <button
              onClick={handleAddLadiesDay}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              {isAuthenticated ? 'レディースデー情報を追加' : 'ログインして情報を追加'}
            </button>

            {/* レディースデー一覧 */}
            <div className="space-y-4">
              {sauna.ladiesDays.length > 0 ? (
                sauna.ladiesDays.map((ladiesDay) => (
                  <div key={ladiesDay.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-pink-600 mr-2" />
                        <span className="font-medium">
                          {ladiesDay.dayOfWeek !== null 
                            ? `毎週${getDayName(ladiesDay.dayOfWeek)}曜日`
                            : ladiesDay.specificDate 
                              ? new Date(ladiesDay.specificDate).toLocaleDateString()
                              : '日時未設定'
                          }
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        ladiesDay.isOfficial 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ladiesDay.isOfficial ? '公式' : 'ユーザー投稿'}
                      </span>
                    </div>
                    
                    {(ladiesDay.startTime || ladiesDay.endTime) && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {ladiesDay.startTime || '開始時間未設定'} - {ladiesDay.endTime || '終了時間未設定'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          賛成: {ladiesDay.supportCount}
                        </span>
                        <span className="text-sm text-gray-600">
                          反対: {ladiesDay.oppositionCount}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{ladiesDay.trustScore.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだレディースデー情報がありません
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaunaDetail;