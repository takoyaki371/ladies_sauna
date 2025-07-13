# Ladies Sauna App

女性向けサウナ検索・レビューアプリケーション

## 機能

- 🏖️ サウナ検索・一覧表示
- 👩 レディースデイ情報の確認・投稿
- ⭐ サウナレビューの閲覧
- 🗺️ 地図でのサウナ位置確認
- 👤 ユーザー登録・ログイン
- ❤️ お気に入りサウナ登録

## 技術スタック

**フロントエンド:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router
- Leaflet (地図)

**バックエンド:**
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT認証

## 開発環境セットアップ

### 必要な環境
- Node.js 18+
- npm

### インストールと起動

1. リポジトリをクローン
```bash
git clone https://github.com/[your-username]/ladies-sauna.git
cd ladies-sauna
```

2. バックエンドのセットアップ
```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集してJWT_SECRETを設定
npm run dev
```

3. フロントエンドのセットアップ（新しいターミナルで）
```bash
cd frontend
npm install
npm run dev
```

4. ブラウザで http://localhost:5173 を開く

## デプロイ

- フロントエンド: Vercel
- バックエンド: Railway
- データベース: SQLite (開発用) / PostgreSQL (本番用)

## ライセンス

MIT License