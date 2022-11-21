import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonToast,
} from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import { memo, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useRecoilState } from 'recoil';
import { Commands } from '../../consts/Commands.const';
import { BaseResponse } from '../../data/Base.response';
import { ErrorAlertService } from '../../services/ErrorAlert.service';
import { PreviewImageService } from '../../services/PreviewImage.service';
import { SiteCommandsService } from '../../services/SiteCommands.service';
import { siteIdState } from '../../states/SiteId.state';
import './Viewer.scss';

const Viewer: React.FC<RouteComponentProps> = (props) => {
    const { fetchPreviewImage } = PreviewImageService();
    const { showAlert, showErrorAlert, } = ErrorAlertService();
    const [present, dismiss] = useIonToast();
    const [imageData, setImageData] = useState<string>();
    const [selectSiteId, setSelectSiteId] = useRecoilState(siteIdState);
    const [isDetectSiteImage, setIsDetectSiteImage] = useState<boolean>(selectSiteId === undefined);

    const { doCommand } = SiteCommandsService();

    useEffect(() => {
        // 2秒ごとに画像を取得
        const interval = setInterval(() => {
            fetchPreviewImage().then(data => {
                setImageData(data);
            })
        }, 1000 * 2);

        //クリーンアップ
        return () => { clearInterval(interval); };
    }, []);

    /** サイト画像決定 */
    const onClickDetectSiteImage = async () => {
        try {
            const response: BaseResponse = await doCommand(-1, Commands.DETECT_SITE);
            if (response.return_code === 0) {
                // メッセージ表示
                await present({
                    message: 'ターゲットサイト画像確定コマンドを実行しました。',
                    duration: 1500
                });
            } else {
                await showAlert(response, undefined);
            }
        } catch (e) {
            await showErrorAlert(e, undefined);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref='/home' />
                    </IonButtons>

                    <IonTitle>ap2n</IonTitle>

                    <IonTitle slot='end'>
                        Site ID = {selectSiteId === undefined ? 'None' : selectSiteId}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className='root'>
                    <div className='preview-box'>
                        <img src={imageData}></img>
                    </div>
                </IonGrid>
            </IonContent>

            <IonFab horizontal='center' vertical='bottom'>
                <IonFabButton onClick={onClickDetectSiteImage}>
                    <IonIcon icon={checkmarkOutline}></IonIcon>
                </IonFabButton>
            </IonFab>

        </IonPage>
    );
};

export default memo(Viewer);