import { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Heart, 
  Star, 
  Award, 
  Users, 
  MessageCircle,
  ChevronRight 
} from 'lucide-react';

export default function Profile() {
  const [user] = useState({
    username: 'サウナ愛好家',
    email: 'user@example.com',
    avatar: null,
    trustScore: 4.2,
    contributionCount: 15,
    reviewCount: 8,
    postCount: 12,
    favoriteCount: 5,
    friendCount: 3,
    joinDate: '2025-01-15',
  });

  const menuItems = [
    {
      icon: Heart,
      label: 'お気に入りサウナ',
      value: `${user.favoriteCount}件`,
      color: 'text-pink-500',
    },
    {
      icon: Star,
      label: 'レビュー',
      value: `${user.reviewCount}件`,
      color: 'text-yellow-500',
    },
    {
      icon: MessageCircle,
      label: 'つぶやき',
      value: `${user.postCount}件`,
      color: 'text-blue-500',
    },
    {
      icon: Users,
      label: 'フレンド',
      value: `${user.friendCount}人`,
      color: 'text-green-500',
    },
  ];

  const settingsItems = [
    {
      icon: Bell,
      label: '通知設定',
      description: 'レディースデイの通知タイミング',
    },
    {
      icon: Settings,
      label: 'アカウント設定',
      description: 'プロフィール・パスワード変更',
    },
  ];

  const getTrustBadge = (score: number) => {
    if (score >= 4.5) return { label: 'エキスパート', color: 'bg-purple-100 text-purple-600' };
    if (score >= 4.0) return { label: '信頼ユーザー', color: 'bg-blue-100 text-blue-600' };
    if (score >= 3.5) return { label: 'レギュラー', color: 'bg-green-100 text-green-600' };
    return { label: 'ビギナー', color: 'bg-gray-100 text-gray-600' };
  };

  const badge = getTrustBadge(user.trustScore);

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded ${badge.color}`}>
                {badge.label}
              </span>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600">信頼度 {user.trustScore}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-pink-500">{user.contributionCount}</div>
          <div className="text-sm text-gray-500">
            コントリビューション
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(user.joinDate).toLocaleDateString('ja-JP')} から参加
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">活動状況</h3>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.value}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="font-semibold">設定</h3>
        </div>
        <div className="divide-y">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">最近の活動</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span className="text-gray-600">スカイスパYOKOHAMAをお気に入りに追加</span>
            <span className="text-gray-400">2日前</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">ラクーアにレビューを投稿</span>
            <span className="text-gray-400">5日前</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">信頼度スコアが4.2にアップ</span>
            <span className="text-gray-400">1週間前</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200">
        ログアウト
      </button>
    </div>
  );
}