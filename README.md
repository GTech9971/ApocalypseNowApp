# ApocalypseNowApp

# 開発環境
- Mac mini(M1,2020), MacBookAir(M1,2020)
- macOS venture 13.0.1
- Xcode 14.1
- nodejs 16.14.0
- react@18.2.0
- ionic/cli@6.20.3
- capacitor@4.4.0 

## バックエンドAPIと通信

### proxy設定
なにもしていないとcross corsエラーが発生するので、package.jsonに以下を追加する

```
proxy:"バックエンドのip:port",
```

http-proxy-middlewareも試してみたが、動作しなかった。


## iosビルド
プロジェクトフォルダ内で以下のコマンドを実行
- `ionic build --prod`
- `ionic integrations enable capacitor`
- `ionic cap add ios`

Xcodeで開く
- `npx cap open ios`

変更点をXcodeに反映させる
- `ionic build --prod`
- `npx cap copy`

## プラグイン(capacitor)

### [カメラプレビュー](https://github.com/capacitor-community/camera-preview)
プラグインを以下のコマンドを実行してインストール

- `npm install @capacitor-community/camera-preview`

- `ionic cap sync`

#### CamepraPreviewを使用するには以下のようにコードを記載する

CameraUpload.tsx

```
...
import { camera, closeCircle, cameraReverse } from "ionicons/icons";
import { useCallback, useEffect, useState } from 'react';
import './CameraUpload.scss';

import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';

const CameraUpload: React.FC = () => {
    // カメラプレビューのセットアップ
    const cameraPreviewOptions: CameraPreviewOptions = {
        position: 'rear',
        height: 1920,
        width: 1080,
        parent: 'cameraPreview'
    };
    const captureOptions: CameraPreviewPictureOptions = { quality: 90 };
    CameraPreview.start();

    /** カメラ停止 */
    const onClickStopCameraBtn = useCallback(async () => {
        await CameraPreview.stop();        
    }, []);

    /** 写真撮影時のイベント */
    const onClickcCaptureBtn = useCallback(async () => { 
        const imageSrc: string = (await CameraPreview.capture(captureOptions))?.value;
        if (!imageSrc) { return; }       
    }, []);

    /** カメラ反転ボタン */
    const onClickFlipCameraBtn = useCallback(async () => {
        await CameraPreview.flip();
    }, []);

    return (
        <IonPage>
            <IonContent fullscreen>
                <div id='cameraPreview' className='cameraPreview'>
                </div>

                {/* カメラ停止 */}
                <IonFab vertical='bottom' horizontal='start' slot='fixed'>
                    <IonFabButton onClick={onClickStopCameraBtn}>
                        <IonIcon icon={closeCircle} ></IonIcon>
                    </IonFabButton>
                </IonFab>

                {/* キャプチャ & カメラ起動 */}
                <IonFab vertical='bottom' horizontal='center' slot='fixed'>
                    <IonFabButton onClick={onClickcCaptureBtn}>
                        <IonIcon icon={camera} ></IonIcon>
                    </IonFabButton>
                </IonFab>

                {/* カメラ反転 */}
                <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                    <IonFabButton onClick={onClickFlipCameraBtn}>
                        <IonIcon icon={cameraReverse} ></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};
export default CameraUpload;
```

CameraUpload.scss

```
ion-content{
    --background:transparent;
}

.cameraPreview{
    display: flex;
    width: 100%;
    height: 80%;
    position: absolute;
}
```

#### info.plist
以下の項目をinfo.plistに追加して、権限を付与する

- `NSCameraUsageDescription`

- `NSMicrophoneUsageDescription`

マイクの使用は、optionsのdisableAudioをtrueに指定すれば不要