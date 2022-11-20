import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import { memo, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useRecoilState } from 'recoil';
import { PreviewImageService } from '../../services/PreviewImage.service';
import { siteIdState } from '../../states/SiteId.state';
import './Viewer.scss';

const Viewer: React.FC<RouteComponentProps> = (props) => {
    const { fetchPreviewImage } = PreviewImageService();
    const [imageData, setImageData] = useState<string>();
    const [selectSiteId, setSelectSiteId] = useRecoilState(siteIdState);

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