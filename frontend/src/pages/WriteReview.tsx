import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Calendar, Eye, EyeOff } from 'lucide-react';
import { reviewService } from '../services/review';
import { saunaService } from '../services/sauna';

interface SaunaInfo {
  id: string;
  name: string;
  address: string;
}

const WriteReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sauna, setSauna] = useState<SaunaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  // フォームの状態
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    visitDate: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoveredStar, setHoveredStar] = useState(0);

  // サウナ情報を取得
  useEffect(() => {
    const fetchSauna = async () => {
      if (id) {
        try {
          const saunaData = await saunaService.getSauna(id);
          setSauna({
            id: saunaData.id,
            name: saunaData.name,
            address: saunaData.address
          });
        } catch (error) {
          console.error('サウナ情報の取得に失敗:', error);
          // フォールバック: テストデータを使用
          setSauna({
            id: 'test-sauna-id',
            name: 'テストサウナ',
            address: '東京都渋谷区テスト1-1-1'
          });
        }
      }
    };

    fetchSauna();
  }, [id]);

  // 今日の日付をデフォルトに設定
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, visitDate: today }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = '評価を選択してください';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルを入力してください';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'レビュー内容を入力してください';
    }
    if (!formData.visitDate) {
      newErrors.visitDate = '訪問日を選択してください';
    } else {
      const visitDate = new Date(formData.visitDate);
      const today = new Date();
      if (visitDate > today) {
        newErrors.visitDate = '未来の日付は選択できません';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // API投稿処理
      const reviewData = {
        saunaId: id!,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        visitDate: formData.visitDate,
        visibility: formData.visibility
      };

      await reviewService.createReview(reviewData);

      // 投稿成功時はサウナ詳細ページに戻る
      navigate(`/sauna/${id}?tab=reviews`);
    } catch (error) {
      console.error('レビュー投稿エラー:', error);
      setErrors({ submit: 'レビューの投稿に失敗しました。もう一度お試しください。' });
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Eye className="h-4 w-4" />;
      case 'FRIENDS':
        return <Eye className="h-4 w-4" />;
      case 'PRIVATE':
        return <EyeOff className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return '公開（すべてのユーザーが閲覧可能）';
      case 'FRIENDS':
        return 'フレンド限定（フレンドのみ閲覧可能）';
      case 'PRIVATE':
        return '非公開（自分のみ閲覧可能）';
      default:
        return '公開';
    }
  };

  if (!sauna) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
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
            disabled={loading}
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-bold text-gray-900">レビューを投稿</h1>
          <p className="text-sm text-gray-600 mt-1">{sauna.name}</p>
        </div>
      </div>

      {/* フォーム */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 評価 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              評価 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredStar || formData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating}/5
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* タイトル */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="レビューのタイトルを入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* レビュー内容 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              レビュー内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="サウナの感想や詳細な体験談を書いてください"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.content.length}/1000
              </p>
            </div>
          </div>

          {/* 訪問日 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              訪問日 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.visitDate && (
              <p className="mt-1 text-sm text-red-600">{errors.visitDate}</p>
            )}
          </div>

          {/* 公開設定 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              公開設定
            </label>
            <div className="space-y-2">
              {[
                { value: 'PUBLIC', label: '公開' },
                { value: 'FRIENDS', label: 'フレンド限定' },
                { value: 'PRIVATE', label: '非公開' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={formData.visibility === option.value}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                  />
                  <div className="ml-3 flex items-center">
                    {getVisibilityIcon(option.value)}
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {getVisibilityText(formData.visibility)}
            </p>
          </div>

          {/* エラーメッセージ */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* 投稿ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                投稿中...
              </>
            ) : (
              'レビューを投稿'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;