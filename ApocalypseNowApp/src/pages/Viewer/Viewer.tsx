import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonImg,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { memo, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { PreviewImageService } from '../../services/PreviewImage.service';
import './Viewer.scss';

const Viewer: React.FC<RouteComponentProps> = (props) => {
    const { fetchPreviewImage } = PreviewImageService();
    const [imageData, setImageData] = useState<string>();

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

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>

                    <IonTitle>ap2n</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {/* <img src={imageData}></img> */}
                <IonImg src={imageData}></IonImg>
            </IonContent>
        </IonPage>
    );
};

export default memo(Viewer);