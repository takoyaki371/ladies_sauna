import { Calendar, Heart, Plus, MapPin } from 'lucide-react';
import { useTodaysLadiesDays } from '../hooks/useLadiesDays';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Home() {
  const { ladiesDays, isLoading, error } = useTodaysLadiesDays();
  const { user, isAuthenticated } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Today's Ladies Day */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-semibold">今日のレディースデイ</h2>
        </div>
        
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          {isLoading ? (
            <div className="text-center text-pink-600">読み込み中...</div>
          ) : error ? (
            <div className="text-center text-red-600">エラーが発生しました</div>
          ) : ladiesDays.length > 0 ? (
            <div className="space-y-3">
              {ladiesDays.map(ladiesDay => (
                <div key={ladiesDay.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-pink-800">{ladiesDay.sauna.name}</h3>
                    <p className="text-sm text-pink-600">本日開催中！</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                        信頼度: {ladiesDay.trustScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-pink-600">
                        👍 {ladiesDay.supportCount}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/sauna/${ladiesDay.saunaId}`}
                    className="bg-pink-500 text-white px-3 py-1 rounded-md text-sm hover:bg-pink-600"
                  >
                    詳細
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-pink-600 text-center">
              今日開催中のレディースデイはありません
            </p>
          )}
        </div>
      </section>

      {/* Favorite Saunas Calendar */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-semibold">お気に入りカレンダー</h2>
          </div>
          <button className="text-pink-500 text-sm">編集</button>
        </div>

        {isAuthenticated ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              お気に入りのサウナを追加して<br />
              レディースデイをチェックしましょう
            </p>
            <Link 
              to="/search"
              className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto w-fit hover:bg-pink-600"
            >
              <Plus className="w-4 h-4" />
              サウナを探す
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              ログインしてお気に入り機能を<br />
              ご利用ください
            </p>
            <Link 
              to="/login"
              className="bg-pink-500 text-white px-4 py-2 rounded-lg mx-auto block w-fit hover:bg-pink-600"
            >
              ログイン
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">クイックアクション</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link 
            to="/map"
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50"
          >
            <MapPin className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium">近くのサウナ</span>
          </Link>
          <Link 
            to="/search?hasLadiesDay=true"
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50"
          >
            <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium">レディースデイ</span>
          </Link>
        </div>
      </section>
    </div>
  );
}