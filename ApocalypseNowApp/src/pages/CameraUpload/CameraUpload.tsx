import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { camera, closeCircle, cameraReverse } from "ionicons/icons";
import { useEffect, useState } from 'react';
import './CameraUpload.scss';

import { TargetSitesService } from '../../services/TargetSites.service';
import { useRecoilState } from 'recoil';
import { logInDataState } from '../../states/LogIn.data.state';
import { BaseResponse, ReturnCode } from '../../data/Base.response';
import { UploadOriginalTargetSiteResponse } from '../../data/UploadOriginalTargetSite.response';
import { ErrorAlertService } from '../../services/ErrorAlert.service';
import { ShootTargetSiteResponse } from '../../data/ShootTargetSite.response';

import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { siteIdState } from '../../states/SiteId.state';
import { PreviewImageService } from '../../services/PreviewImage.service';


const CameraUpload: React.FC = () => {
    const [logInData] = useRecoilState(logInDataState);
    const [selectSiteId, setSelectSiteId] = useRecoilState(siteIdState);

    // カメラプレビューのセットアップ
    const [isStartCamera, setIsStartCamera] = useState<boolean>(false);
    const cameraPreviewOptions: CameraPreviewOptions = {
        position: 'rear',
        height: 1920,
        width: 1080,
        parent: 'cameraPreview'
    };
    const captureOptions: CameraPreviewPictureOptions = { quality: 90 };

    const { uploadInitialTargetSiteImage, shootTargetSite } = TargetSitesService();
    const { uploadPreviewImage } = PreviewImageService();
    const { showAlert, showErrorAlert } = ErrorAlertService();

    useEffect(() => {
        (async () => {
            if (isStartCamera) { return; }
            await CameraPreview.start(cameraPreviewOptions);
            setIsStartCamera(true);
        })()

        /** 2秒ごとにプレビュー画像をアップロード */
        const interval = setInterval(async () => {
            const previewOptions: CameraPreviewPictureOptions = { quality: 50 };
            const imageSrc: string = (await CameraPreview.capture(previewOptions))?.value;
            if (!imageSrc) { return; }

            /** 射撃後の画像アップ */
            const response: BaseResponse = await uploadPreviewImage(imageSrc);
        }, 1000 * 2);
        //クリーンアップ
        return () => { clearInterval(interval); };
    }, []);

    /**
     * 初回画像のアップロード
     * @param imageSrc 
     * @param fileName 
     */
    const uploadInitialImage = async (imageSrc: string, fileName: string) => {
        try {
            const response: UploadOriginalTargetSiteResponse = await uploadInitialTargetSiteImage(logInData, imageSrc, fileName);
            if (response.return_code === ReturnCode.Success) {
                //APIから帰ってきたSiteIdを選択する
                setSelectSiteId(response.target_site.site_id)
            } else {
                await showAlert(response, undefined);
            }
        } catch (e: unknown) {
            await showErrorAlert(e, "APIサーバーとの接続に失敗 ");
        }
    }

    /**
     * 射撃後の画像アップロード
     * @param imageSrc 
     * @param fileName 
     */
    const shootTarget = async (imageSrc: string, fileName: string) => {
        try {
            const response: ShootTargetSiteResponse = await shootTargetSite(logInData, selectSiteId, imageSrc, fileName);
            if (response.return_code === ReturnCode.Success) {
                // TODO ヒットポイント座標受け取り後の処理
            } else {
                await showAlert(response, undefined);
            }
        } catch (e: unknown) {
            await showErrorAlert(e, "APIサーバーとの接続に失敗 ");
        }
    }

    /** カメラ停止 */
    const onClickStopCameraBtn = async () => {
        if (isStartCamera === false) { }
        await CameraPreview.stop();
        setIsStartCamera(false);
    }

    /** 写真撮影時のイベント */
    const onClickcCaptureBtn = async () => {
        // カメラが停止していれば開始する
        if (isStartCamera === false) {
            await CameraPreview.start(cameraPreviewOptions);
            setIsStartCamera(true);
            return;
        }

        const imageSrc: string = (await CameraPreview.capture(captureOptions))?.value;
        if (!imageSrc) { return; }

        /** 射撃後の画像アップ */
        const fileName: string = "sample.png"; //TODO
        if (selectSiteId) {
            await shootTarget(imageSrc, fileName);
        } else { /** 初回アップロード時 */
            await uploadInitialImage(imageSrc, fileName);
        }
    }

    /** カメラ反転ボタン */
    const onClickFlipCameraBtn = async () => {
        if (isStartCamera === false) { return; }
        await CameraPreview.flip();
    };



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>

                    <IonTitle >ap2n</IonTitle>
                </IonToolbar>
            </IonHeader>
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

            <IonFooter>
                <IonToolbar>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default CameraUpload;
