import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Info, CheckCircle } from 'lucide-react';
import { ladiesDayService } from '../services/ladiesDay';
import { saunaService } from '../services/sauna';

interface SaunaInfo {
  id: string;
  name: string;
  address: string;
}

const AddLadiesDay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sauna, setSauna] = useState<SaunaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  // フォームの状態
  const [formData, setFormData] = useState({
    scheduleType: 'weekly' as 'weekly' | 'specific',
    dayOfWeek: '',
    specificDate: '',
    startTime: '',
    endTime: '',
    isAllDay: false,
    sourceType: 'USER' as 'OFFICIAL' | 'USER',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 曜日の選択肢
  const daysOfWeek = [
    { value: '0', label: '日曜日' },
    { value: '1', label: '月曜日' },
    { value: '2', label: '火曜日' },
    { value: '3', label: '水曜日' },
    { value: '4', label: '木曜日' },
    { value: '5', label: '金曜日' },
    { value: '6', label: '土曜日' }
  ];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.scheduleType === 'weekly') {
      if (!formData.dayOfWeek) {
        newErrors.dayOfWeek = '曜日を選択してください';
      }
    } else {
      if (!formData.specificDate) {
        newErrors.specificDate = '日付を選択してください';
      } else {
        const selectedDate = new Date(formData.specificDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.specificDate = '過去の日付は選択できません';
        }
      }
    }

    if (!formData.isAllDay) {
      if (!formData.startTime) {
        newErrors.startTime = '開始時間を入力してください';
      }
      if (!formData.endTime) {
        newErrors.endTime = '終了時間を入力してください';
      }
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        newErrors.endTime = '終了時間は開始時間より後に設定してください';
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
      const submitData = {
        saunaId: id!,
        dayOfWeek: formData.scheduleType === 'weekly' ? parseInt(formData.dayOfWeek) : undefined,
        specificDate: formData.scheduleType === 'specific' ? formData.specificDate : undefined,
        startTime: formData.isAllDay ? undefined : formData.startTime,
        endTime: formData.isAllDay ? undefined : formData.endTime,
        isOfficial: formData.sourceType === 'OFFICIAL',
        sourceType: formData.sourceType
      };

      await ladiesDayService.createLadiesDay(submitData);

      // 投稿成功時はサウナ詳細ページに戻る
      navigate(`/sauna/${id}?tab=ladies-days`);
    } catch (error) {
      console.error('レディースデー投稿エラー:', error);
      setErrors({ submit: 'レディースデー情報の追加に失敗しました。もう一度お試しください。' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          <h1 className="text-xl font-bold text-gray-900">レディースデー情報を追加</h1>
          <p className="text-sm text-gray-600 mt-1">{sauna.name}</p>
        </div>
      </div>

      {/* フォーム */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 注意事項 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-1">投稿前にご確認ください</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 正確な情報の投稿にご協力ください</li>
                  <li>• 他のユーザーが投票で情報の信頼性を判断します</li>
                  <li>• 公式な情報は施設に直接確認することをお勧めします</li>
                </ul>
              </div>
            </div>
          </div>

          {/* スケジュールタイプ */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              スケジュールタイプ <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scheduleType"
                  value="weekly"
                  checked={formData.scheduleType === 'weekly'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <span className="ml-3 text-sm text-gray-700">毎週決まった曜日</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scheduleType"
                  value="specific"
                  checked={formData.scheduleType === 'specific'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <span className="ml-3 text-sm text-gray-700">特定の日付</span>
              </label>
            </div>
          </div>

          {/* 曜日選択（毎週の場合） */}
          {formData.scheduleType === 'weekly' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                曜日 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">曜日を選択してください</option>
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              {errors.dayOfWeek && (
                <p className="mt-1 text-sm text-red-600">{errors.dayOfWeek}</p>
              )}
            </div>
          )}

          {/* 日付選択（特定日の場合） */}
          {formData.scheduleType === 'specific' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日付 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.specificDate}
                  onChange={(e) => handleInputChange('specificDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.specificDate && (
                <p className="mt-1 text-sm text-red-600">{errors.specificDate}</p>
              )}
            </div>
          )}

          {/* 終日設定 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAllDay}
                onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="ml-3 text-sm text-gray-700">終日（営業時間中すべて）</span>
            </label>
          </div>

          {/* 時間設定（終日でない場合） */}
          {!formData.isAllDay && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                時間 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">開始時間</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.startTime && (
                    <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">終了時間</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.endTime && (
                    <p className="mt-1 text-xs text-red-600">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 情報源 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              情報源
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sourceType"
                  value="OFFICIAL"
                  checked={formData.sourceType === 'OFFICIAL'}
                  onChange={(e) => handleInputChange('sourceType', e.target.value)}
                  className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <div className="ml-3">
                  <span className="text-sm text-gray-700">公式情報</span>
                  <p className="text-xs text-gray-500">施設の公式サイトやスタッフからの情報</p>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sourceType"
                  value="USER"
                  checked={formData.sourceType === 'USER'}
                  onChange={(e) => handleInputChange('sourceType', e.target.value)}
                  className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <div className="ml-3">
                  <span className="text-sm text-gray-700">利用者情報</span>
                  <p className="text-xs text-gray-500">実際に利用した際の経験や観察</p>
                </div>
              </label>
            </div>
          </div>

          {/* 備考 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              備考（任意）
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="追加の情報や注意点があれば記入してください"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.notes.length}/500
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
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                レディースデー情報を追加
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLadiesDay;