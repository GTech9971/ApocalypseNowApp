import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader,
    IonIcon,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { camera, closeCircle, cameraReverse } from "ionicons/icons";
import { useCallback, useEffect, useState } from 'react';
import './CameraUpload.scss';

import { TargetSitesService } from '../../services/TargetSites.service';
import { useRecoilState } from 'recoil';
import { logInDataState } from '../../states/LogIn.data.state';
import { TargetSiteData } from '../../data/TargetSite.data';
import { FetchAllTargetSiteResponse } from '../../data/FetchAllTargetSite.response';
import { ReturnCode } from '../../data/Base.response';
import { UploadOriginalTargetSiteResponse } from '../../data/UploadOriginalTargetSite.response';
import { ErrorAlertService } from '../../services/ErrorAlert.service';
import { ShootTargetSiteResponse } from '../../data/ShootTargetSite.response';

import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';


const CameraUpload: React.FC = () => {

    const [logInData] = useRecoilState(logInDataState);
    const [targetSiteList, setTargetSiteList] = useState<TargetSiteData[]>([]);
    const [selectTargetSite, setSelectTargetSite] = useState<TargetSiteData>();

    // カメラプレビューのセットアップ
    const [isStartCamera, setIsStartCamera] = useState<boolean>(false);
    const cameraPreviewOptions: CameraPreviewOptions = {
        position: 'rear',
        height: 1920,
        width: 1080,
        parent: 'cameraPreview'
    };
    const captureOptions: CameraPreviewPictureOptions = { quality: 90 };


    const { fetchAllTargetSite, uploadInitialTargetSiteImage, shootTargetSite, createTargetSiteModel } = TargetSitesService();
    const { showAlert, showErrorAlert } = ErrorAlertService();


    /** 初回起動時にTargetSiteを取得する */
    useEffect(() => {
        (async () => {
            // try {
            //     const response: FetchAllTargetSiteResponse = await fetchAllTargetSite(logInData);
            //     if (response.return_code === ReturnCode.Success) {
            //         setTargetSiteList(response.target_site_list);
            //     } else {
            //         await showAlert(response, undefined);
            //     }
            // } catch (e: unknown) {
            //     await showErrorAlert(e, "APIサーバーとの接続に失敗 ");
            // }
        })();
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
                setSelectTargetSite(response.target_site);
                setTargetSiteList(([...targetSiteList, response.target_site]));
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
    const shootTarget = async (targetSite: TargetSiteData, imageSrc: string, fileName: string) => {
        try {
            const response: ShootTargetSiteResponse = await shootTargetSite(logInData, targetSite, imageSrc, fileName);
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
    const onClickStopCameraBtn = useCallback(async () => {
        if (isStartCamera === false) { }
        await CameraPreview.stop();
        setIsStartCamera(false);
    }, []);

    /** 写真撮影時のイベント */
    const onClickcCaptureBtn = useCallback(async () => {
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
        if (selectTargetSite) {
            await shootTarget(selectTargetSite, imageSrc, fileName);
        } else { /** 初回アップロード時 */
            await uploadInitialImage(imageSrc, fileName);
        }
    }, []);

    /** カメラ反転ボタン */
    const onClickFlipCameraBtn = useCallback(async () => {
        if (isStartCamera === false) { return; }
        await CameraPreview.flip();
    }, []);



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>

                    <IonTitle >ap2n</IonTitle>

                    <IonSelect slot='end' placeholder='SiteIdを選択'
                        onIonChange={e => { setSelectTargetSite(createTargetSiteModel(Number.parseInt(e.detail.value))) }}>
                        {targetSiteList.map((data, index) => {
                            return (
                                <IonSelectOption key={index} value={data}>
                                    {data.site_id}
                                </IonSelectOption>
                            )
                        })}
                    </IonSelect>
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
                <IonToolbar >

                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default CameraUpload;
