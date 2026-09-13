# とやま名水めぐり

## アプリの目的

富山県内の名水スポットを地図で探し、現地を訪問してGPSによるデジタルスタンプを獲得するスマートフォン向け観光Webアプリです。オープンデータを活用し、GitHub Pagesだけで完結する静的サイトとして提供します。

## 主な機能

- **ホーム画面**: 総スポット数、訪問数、達成率の表示および地図・スタンプ帳への遷移
- **地図画面**: OpenStreetMapによる地図表示、名水スポットマーカー、現在地表示、市町村フィルター、検索機能
- **スポット一覧画面**: ソート・フィルター機能（名称検索、市町村絞り込み、訪問済み表示、距離順ソート）
- **名水詳細画面**: スポット情報の詳細表示、GPSチェックイン機能（100m以内）、外部地図リンク
- **スタンプ帳画面**: 達成率、バッジ表示（はじめの一滴・名水ビギナー・名水めぐり人・富山名水マスター）、訪問履歴一覧、データ初期化
- **設定画面**: 利用方法、位置情報目的、データ出典、プライバシー説明、データ初期化、バージョン表示

## 使用技術

- React 19
- TypeScript
- Vite 5
- React Router (HashRouter)
- Leaflet
- react-leaflet
- OpenStreetMap タイル
- CSS Modules
- localStorage
- Vitest
- ESLint

## ディレクトリ構成

```
meisui/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions ワークフロー
├── node_modules/
├── public/
│   └── data/
│       └── meisui.json      # 名水スポットデータ（JSON形式）
├── scripts/
│   └── convert-xlsx.mjs     # XLSXからJSONへ変換スクリプト
├── src/
│   ├── App.tsx              # アプリルート、HashRouter設定
│   ├── main.tsx             # エントリーポイント
│   ├── types/
│   │   └── meisui.ts        # 型定義
│   ├── hooks/
│   │   ├── useMeisuiData.ts # データ取得フック
│   │   ├── useGeolocation.ts # 位置情報フック
│   │   └── useVisits.ts     # localStorage管理フック
│   ├── components/
│   │   ├── AppHeader.tsx    # ヘッダー
│   │   ├── BottomNavigation.tsx # 底部ナビゲーション
│   │   ├── LoadingView.tsx  # ローディング表示
│   │   ├── ErrorView.tsx    # エラー表示
│   │   ├── EmptyView.tsx    # 空データ表示
│   │   ├── ProgressCard.tsx # 達成率カード
│   │   ├── SpotCard.tsx     # スポットカード
│   │   ├── SpotMarker.tsx   # マーカーコンポーネント
│   │   ├── MunicipalityFilter.tsx # 市町村フィルター
│   │   ├── SearchBox.tsx    # 検索ボックス
│   │   └── StampBadge.tsx   # スタンプバッジ
│   └── pages/
│       ├── HomePage.tsx     # ホーム画面
│       ├── MapPage.tsx      # 地図画面
│       ├── SpotListPage.tsx # スポット一覧画面
│       ├── SpotDetailPage.tsx # 名水詳細画面
│       ├── StampBookPage.tsx # スタンプ帳画面
│       ├── SettingsPage.tsx # 設定画面
│       └── NotFoundPage.tsx # 404画面
│── styles/
│   └── global.css           # グローバルスタイル
├── .eslintrc.json           # ESLint 設定
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
└── spec.md
```

## セットアップ方法

### npm install

プロジェクトのルートディレクトリで以下を実行して依存パッケージをインストールします。

```
npm install
```

### npm run dev

ローカル開発サーバーを起動します。

```
npm run dev
```

ブラウザで `http://localhost:5173` (またはポート5174以降) が開きます。

### npm run test

Vitest を使用してテストを実行します。

```
npm run test
```

または

```
npm run test:run
```

### npm run build

TypeScriptの型チェックとViteビルドを実行します。

```
npm run build
```

ビルド成果物は `dist/` ディレクトリに生成されます。

### npm run preview

ビルドされたアプリをローカルでプレビューします。

```
npm run preview
```

### npm run convert-data

ローカルのXLSXファイルを public/data/meisui.json へ変換します。

```
npm run convert-data -- ./data/meisui.xlsx
```

## GitHub Pagesへの公開方法

リポジトリの Settings ページから以下の手順で公開設定を行います。

1. GitHubのリポジトリトップページで [Settings] を開く
2. 左メニューの [Pages] を選択
3. [Source] ドロップダウンメニューで [GitHub Actions] を選択
4. 保存すると自動的にデプロイが開始されます

### GitHub Actions による自動デプロイ

リポジトリの `.github/workflows/deploy.yml` が自動デプロイを担当します。 main ブランチへの push と workflow_dispatch による手動実行の両方に対応しています。

- `npm ci`: 依存パッケージをインストール
- `npm run test`: テストを実行
- `npm run build`: 型チェックと Vite ビルドを実行
- `actions/configure-pages`: Pages 環境を設定
- `actions/upload-pages-artifact`: `dist` ディレクトリをアップロード
- `actions/deploy-pages`: GitHub Pages にデプロイ

Node.js の LTS バージョン (20) が使用されます。

## オープンデータの出典

本アプリで使用しているデータは、以下のオープンデータを利用しています。

- **とやまの名水一覧**: 富山県オープンデータポータルサイト
  - URL: https://ckan.tdcp.pref.toyama.jp/dataset/meisui/resource/3e98a397-8090-48bc-8a7e-0225e2834a41

データはリポジトリ内の `public/data/meisui.json` として保持され、毎回の外部直接取得は行いません。

## サンプルデータ利用時の注意

- `public/data/meisui.json` に含まれる5件のスポットは開発確認用のサンプルデータです
- 実際の富山県の名水データに置き換える場合は、`scripts/convert-xlsx.mjs` を使用して XLSX から JSON に変換してください
- 緯度・経度が null のスポットは地図上に表示されず、GPSチェックインの対象外となります
- 一部のデータ項目が空欄の場合は、空文字または null に正規化されます

## XLSXからJSONへ変換する方法

ローカルに保存したとやまの名水一覧のXLSXファイルを変換します。

```
npm run convert-data -- ./data/meisui.xlsx
```

変換スクリプトの主な処理:

1. xlsxパッケージで最初のワークシートを読み込む
2. 列名から対応するカラムを検出（名称の他に「名水名」「スポット名」などにも対応）
3. 緯度・経度の変換と範囲チェック（-90〜90, -180〜180）
4. 片方のみ有効な場合は両方を無効化
5. IDの生成（安定したIDがあれば利用、なければ名称・市町村・住所からハッシュ生成）
6. UTF-8・2スペースインデントで JSON 出力
7. 警告件数と変換件数をコンソール出力

詳しくは `scripts/convert-xlsx.mjs` を参照してください。

## 対応ブラウザ

- iOS 15+ (Safari)
- Android 12+ (Chrome)
- デスクトップブラウザ (Chrome, Firefox, Edge, Safari)

スマートフォンの幅320pxでも横スクロールを発生させないレイアウトに対応しています。

## 位置情報はHTTPSまたはlocalhostで利用する必要があります

ブラウザの Geolocation API は、セキュリティの観点から HTTPS 接続または `localhost` でのアクセスが必要です。GitHub Pages 上で位置情報を利用する場合は、HTTPS プロトコルでアクセスしてください。

- `http://` プロトコルでは位置情報が取得できません
- ローカル開発時は `http://localhost:5173` などで動作確認できます
- 位置情報の許可/拒否はブラウザ設定で制御できます

## 保存される情報

- **訪問記録**: `localStorage` に `spotId` と `visitedAt` (ISO 8601形式) を保存
- **バッジ状態**: 訪問回数に基づいたバッジ名のリスト
- **アプリ状態**: 現在画面のハッシュ値などの最小限の状態

保存先: `localStorage.getItem('toyama-meisui:visits')`
形式: `[{spotId: string, visitedAt: string}, ...]`

## 保存されない情報

- 個人名、メールアドレス
- 正確な現在地（経緯度は一時的にのみ保持し、localStorageには保存しない）
- 移動履歴
- GPSで取得した緯度・経度
- サーバーへの送信

位置情報はブラウザ内でのみ処理され、外部サーバーには送信されません。

## 制約事項

- GitHub Pages (静的ホスティング) しか対応しておらず、サーバーサイド機能は持たない
- リアルタイムのデータ更新には対応しておらず、ビルド時のデータが利用される
- 外部認�機能 (SNSログイン、ユーザー登録など)は実装していない
- Google Maps API などの有料サービスは使用していない
- オフライン動作を保証しない (PWA の基本的なみ機能のみ対応)
- ブレークポイントは設定せず、スマートフォンファーストのレスポンシブデザイン
- some CSS プロパティ値は色のみで状態を表現せず、テキストラベルも併用

## 将来拡張

- 実際のとやまの名水一覧データの取り込みシステム
- ユーザーアカウントとログイン機能
- SNS での共有とコメント機能
- フォトギャラリーと写真投稿
- プッシュ通知によるスタンプ期限通知
- 複数のオープンデータセットの統合
- 管理者向けスポット登録機能
- 多言語対応 (英語など)
- ルート最適化と経路検索機能

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## OpenStreetMapの帰属表示

本アプリの地図タイルは OpenStreetMap のタイルを使用しています。以下の帰属表示を必ず表示します。

> Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors

アプリ内の appropriate 場所 (例: フッターや map attribution エリア) にこの表示を配置してください。

## 飲用可否を保証しない旨

本アプリで提供する名水スポットの情報について、以下を保証しません。

- 水の飲用可能性
- 水質の安全性
- 災害時の利用可能性
- 細菌や有害物質の有無

各スポットの `notes` フィールドに明記されていない場合、飲用可能とは表示しません。現地の案内板や管理者の指示を優先し、自己責任での判断をお願いします。

## 現地情報を優先する旨

本アプリで表示する住所、説明、注意事項はオープンデータに基づいていますが、以下の現地情報は常に優先されます。

- 現地の案内板や説明板の内容
- 管理者や自治体の指示
- 立入制限や通行規制の情報
- 季節や天候によるアクセス状況の変化

地図上の情報と現地の状況が異なる場合は、現地の情報を最優先してください。本アプリの情報は目安としてのみご利用ください。