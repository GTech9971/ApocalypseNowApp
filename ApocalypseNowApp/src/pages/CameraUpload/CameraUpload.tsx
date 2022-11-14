import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    useIonAlert,
} from '@ionic/react';
import { cameraOutline } from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from 'react';
import './CameraUpload.scss';
import Webcam from "react-webcam";
import { TargetSitesService } from '../../services/TargetSites.service';
import { useRecoilState } from 'recoil';
import { logInDataState } from '../../states/LogIn.data.state';
import { TargetSiteData } from '../../data/TargetSite.data';
import { FetchAllTargetSiteResponse } from '../../data/FetchAllTargetSite.response';
import { ReturnCode } from '../../data/Base.response';
import { UploadOriginalTargetSiteResponse } from '../../data/UploadOriginalTargetSite.response';
import { ErrorAlertService } from '../../services/ErrorAlert.service';

const CameraUpload: React.FC = () => {

    const [logInData, setlogInData] = useRecoilState(logInDataState);
    const [targetSiteList, setTargetSiteList] = useState<TargetSiteData[]>([]);
    const [selectTargetSite, setSelectTargetSite] = useState<TargetSiteData>();

    const videoConstraints: MediaTrackConstraints = {
        width: 720,
        height: 360,
        facingMode: "user",
    };
    const webcamRef = useRef<Webcam>(null);
    const { fetchAllTargetSite, uploadInitialTargetSiteImage, shootTargetSite, createTargetSiteModel } = TargetSitesService();
    const { showAlert, showErrorAlert } = ErrorAlertService();


    /** 初回起動時にTargetSiteを取得する */
    useEffect(() => {
        (async () => {
            try {
                const response: FetchAllTargetSiteResponse = await fetchAllTargetSite(logInData);
                if (response.return_code === ReturnCode.Success) {
                    setTargetSiteList(response.target_site_list);
                } else {
                    await showAlert(response, undefined);
                }
            } catch (e: unknown) {
                await showErrorAlert(e, "APIサーバーとの接続に失敗 ");
            }
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

    /** 写真撮影時のイベント */
    const onClickcCaptureBtn = useCallback(async () => {
        const imageSrc: string = webcamRef.current?.getScreenshot() as string;
        if (!imageSrc) { return; }

        /** 射撃後の画像アップ */
        if (selectTargetSite) {
            //await uploadShootedTargetSiteImage(loginData, selectTargetSite, imageSrc);
        } else { /** 初回アップロード時 */
            const fileName: string = "";
            await uploadInitialImage(imageSrc, fileName);
        }
    }, [webcamRef]);

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
                <div>
                    <Webcam
                        audio={false}
                        // width={540}
                        // height={360}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                    />
                </div>
            </IonContent>

            <IonFooter>
                <IonToolbar slot='center'>
                    <IonButton size='large' expand='block' fill='outline' onClick={onClickcCaptureBtn}>
                        <IonIcon size='large' icon={cameraOutline}></IonIcon>
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default CameraUpload;
