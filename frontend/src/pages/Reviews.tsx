import { useState } from 'react';
import { Star, MessageCircle, Camera, Lock, Globe } from 'lucide-react';

export default function Reviews() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'posts'>('reviews');

  // Mock data
  const myReviews = [
    {
      id: '1',
      saunaName: 'スカイスパYOKOHAMA',
      rating: 5,
      title: '最高のレディースデイ体験！',
      content: 'お風呂もサウナも最高でした。女性専用エリアがとても清潔で安心して利用できました。',
      visitDate: '2025-07-10',
      isPublic: true,
      likeCount: 12,
      createdAt: '2025-07-11',
    },
    {
      id: '2',
      saunaName: 'ラクーア',
      rating: 4,
      title: 'アクセス良好',
      content: '駅から近くて便利。サウナの温度もちょうど良く、水風呂も気持ち良かったです。',
      visitDate: '2025-07-05',
      isPublic: false,
      likeCount: 0,
      createdAt: '2025-07-06',
    },
  ];

  const myPosts = [
    {
      id: '1',
      saunaName: 'スカイスパYOKOHAMA',
      content: '今日のレディースデイ、めちゃくちゃ空いてて最高でした！🧖‍♀️',
      hasImage: true,
      isPublic: true,
      likeCount: 8,
      createdAt: '2025-07-12',
    },
    {
      id: '2',
      saunaName: 'ラクーア',
      content: 'サウナ後のアイス🍦最高すぎる...',
      hasImage: false,
      isPublic: true,
      likeCount: 5,
      createdAt: '2025-07-08',
    },
  ];

  const getVisibilityIcon = (isPublic: boolean) => {
    return isPublic ? (
      <Globe className="w-4 h-4 text-green-500" />
    ) : (
      <Lock className="w-4 h-4 text-gray-400" />
    );
  };

  const getVisibilityText = (isPublic: boolean) => {
    return isPublic ? '公開' : '非公開';
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">マイレビュー</h1>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          新規投稿
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          レビュー ({myReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'posts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          つぶやき ({myPosts.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {myReviews.map(review => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{review.saunaName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.visitDate).toLocaleDateString('ja-JP')} 訪問
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getVisibilityIcon(review.isPublic)}
                  <span className="text-xs text-gray-500">
                    {getVisibilityText(review.isPublic)}
                  </span>
                </div>
              </div>

              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-gray-700 text-sm mb-3">{review.content}</p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{review.likeCount}</span>
                  </div>
                  <span>{new Date(review.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
                <button className="text-pink-500 hover:text-pink-600">
                  編集
                </button>
              </div>
            </div>
          ))}

          {myReviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">まだレビューがありません</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                初回レビューを書く
              </button>
            </div>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.map(post => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">{post.saunaName}</h3>
                <div className="flex items-center gap-2">
                  {getVisibilityIcon(post.isPublic)}
                  <span className="text-xs text-gray-500">
                    {getVisibilityText(post.isPublic)}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{post.content}</p>

              {post.hasImage && (
                <div className="bg-gray-100 rounded-lg p-8 mb-3 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-500">画像添付済み</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{post.likeCount}</span>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
                <button className="text-pink-500 hover:text-pink-600">
                  編集
                </button>
              </div>
            </div>
          ))}

          {myPosts.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">まだつぶやきがありません</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                初回つぶやきを投稿
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}