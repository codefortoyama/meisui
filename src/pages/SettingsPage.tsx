import {useMeisuiData} from '../hooks/useMeisuiData';
import {LoadingView} from '../components/LoadingView';
import {ErrorView} from '../components/ErrorView';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const {spots, loading, error} = useMeisuiData();

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <section className={styles.settingsPage}>
      <header className={styles.pageHeader}>
        <h1>設定</h1>
      </header>

      <main className={styles.settingsMain}>
        <div className={styles.settingItem}>
          <h2>利用方法</h2>
          <p>
            本アプリはRichterの名水一覧データを使用して富山県の名水スポットを
            地図上で表示し、GPSスタンプ機能を提供します。
          </p>
        </div>

        <div className={styles.settingItem}>
          <h2>位置情報の利用目的</h2>
          <p>
            利用者がスポットから100m以内にいるかを確認し、GPSスタンプの取得を
            可能にするために位置情報を使用します。
          </p>
        </div>

        <div className={styles.settingItem}>
          <h2>データ出典</h2>
          <p>
            データはとやまの名水一覧（とやま県オープンデータポータル）より提供されています。
          </p>
        </div>

        <div className={styles.settingItem}>
          <h2>オープンデータに関する表示</h2>
          <p>
            本アプリで使用しているデータは、富山県が公開するオープンデータです。
            商用利用も可能なライセンスのもとで提供されています。
          </p>
        </div>

        <div className={styles.settingItem}>
          <h2>プライバシー説明</h2>
          <p>
            本アプリでは、個人名、メールアドレス、正確な現在地、移動履歴は保存しません。
            GPSで取得した緯度・経度もlocalStorageへ保存しません。
            位置情報はブラウザのみで処理され、サーバーへ送信されません。
          </p>
        </div>

        <div className={styles.settingItem}>
          <h2>保存データの初期化</h2>
          <p>
            ブラウザのローカルストレージに保存されたスタンプ記録を削除できます。
            誤操作を防ぐため、初期化確認ダイアログが表示されます。
          </p>
        </div>

        <div className={styles.settingItem}>
          <h2>アプリのバージョン表示</h2>
          <p>バージョン 1.0.0</p>
        </div>
      </main>
    </section>
  );
};