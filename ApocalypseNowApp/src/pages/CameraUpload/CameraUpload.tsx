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
} from '@ionic/react';
import { cameraOutline } from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from 'react';
import './CameraUpload.scss';
import Webcam from "react-webcam";
import { TargetSitesService } from '../../services/TargetSites.service';
import { useRecoilState } from 'recoil';
import { logInModelState } from '../../atoms/LogInModel.state';
import { TargetSiteModel } from '../../models/TargetSite.model';

const CameraUpload: React.FC = () => {

    const [logInModel, setLogInModel] = useRecoilState(logInModelState);
    const [targetSiteList, setTargetSiteList] = useState<TargetSiteModel[]>([]);
    const [selectTargetSite, setSelectTargetSite] = useState<TargetSiteModel>();

    const videoConstraints: MediaTrackConstraints = {
        width: 720,
        height: 360,
        facingMode: "user",
    };
    const webcamRef = useRef<Webcam>(null);
    const { fetchAllTargetSite, uploadInitialTargetSiteImage, uploadShootedTargetSiteImage } = TargetSitesService();

    /** 初回起動時にTargetSiteを取得する */
    useEffect(() => {
        (async () => {
            const siteList: TargetSiteModel[] = await fetchAllTargetSite(logInModel);
            setTargetSiteList(siteList);
        })();
    }, []);

    /** 写真撮影時のイベント */
    const onClickcCaptureBtn = useCallback(async () => {
        const imageSrc: string = webcamRef.current?.getScreenshot() as string;
        if (!imageSrc) { return; }

        /** 射撃後の画像アップ */
        if (selectTargetSite) {
            await uploadShootedTargetSiteImage(logInModel, selectTargetSite, imageSrc);
        } else { /** 初回アップロード時 */
            const site: TargetSiteModel = await uploadInitialTargetSiteImage(logInModel, imageSrc);
            // 結果のsiteidを選択ずみにする
            setSelectTargetSite(site);
            // idリストを更新する
            const siteList: TargetSiteModel[] = await fetchAllTargetSite(logInModel);
            setTargetSiteList(siteList);
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
                        onIonChange={e => { setSelectTargetSite({ SiteId: e.detail.value }) }}>
                        {targetSiteList.map((data, index) => {
                            return (
                                <IonSelectOption key={index} value={data}>
                                    {data.SiteId}
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
