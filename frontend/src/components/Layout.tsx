import { ReactNode } from 'react';
import TabNavigation from './TabNavigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-pink-600">
            レディースサウナ
          </h1>
        </div>
      </header>
      
      <main className="max-w-md mx-auto pb-20">
        {children}
      </main>
      
      <TabNavigation />
    </div>
  );
}