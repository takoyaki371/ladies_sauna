import { useLocation, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Search, 
  Star, 
  User 
} from 'lucide-react';

const tabs = [
  { path: '/', label: 'ホーム', icon: Calendar },
  { path: '/map', label: 'マップ', icon: MapPin },
  { path: '/search', label: '検索', icon: Search },
  { path: '/reviews', label: 'レビュー', icon: Star },
  { path: '/profile', label: 'プロフィール', icon: User },
];

export default function TabNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center py-2 px-1 ${
                isActive
                  ? 'text-pink-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}