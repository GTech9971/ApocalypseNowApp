import {
    InputChangeEventDetail,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonGrid,
    IonHeader,
    IonImg,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import './Viewer.scss';



const Viewer: React.FC<RouteComponentProps> = (props) => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot='start'>ap2n</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

            </IonContent>
        </IonPage>
    );
};

export default Viewer;
