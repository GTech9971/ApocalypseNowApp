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
  useIonAlert
} from '@ionic/react';
import './Home.scss';

import headerlogo from "../../images/ap2n-header.png";
import { useRecoilState } from 'recoil';
import { logInModelState } from '../..//atoms/LogInModel.state';
import { LogInModel } from '../../models/LogIn.model';
import { AuthService } from '../../services/Auth.service';
import { RouteComponentProps } from 'react-router';

const Home: React.FC<RouteComponentProps> = (props) => {

  const [loginModel, setLogInModel] = useRecoilState(logInModelState);

  /** IPAddressの入力 */
  const onChangeIpAddressText = (e: InputChangeEventDetail) => {
    if (!e.value) { return; }
    const logInModel: LogInModel = { IPAddress: e.value as string };
    setLogInModel(logInModel);
    console.log(e.value);
  }

  const { checkAPIAddress } = AuthService();

  /** ログインボタン押下時 */
  const [presentAlert] = useIonAlert();
  const onClickLogInBtn = async () => {
    const result: boolean = await checkAPIAddress(loginModel);

    if (result) {
      props.history.push("/CameraUpload");
    } else {
      await presentAlert({
        header: '接続エラー',
        subHeader: "APIサーバーとの接続に失敗 " + loginModel?.IPAddress,
        message: 'IPAddressに誤りがないか、APIサーバーが起動しているか確認してください。'
      });
    }
  }

  const disableBtn: boolean = loginModel?.IPAddress === undefined;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot='start'>ap2n</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCard>
              <IonImg src={headerlogo}></IonImg>

              <IonCardHeader>
                <IonCardTitle>
                  LogIn
                </IonCardTitle>

                <IonCardSubtitle>
                  <IonText>
                    <p>
                      APIのIPAddressを入力して、LOGINボタンを押してください。APIサーバーに接続ができるか確認します。
                    </p>
                  </IonText>

                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          </IonRow>

          <IonRow>
            <IonItem>
              <IonLabel position='stacked'>API Server IPAddress:Port</IonLabel>
              <IonInput onIonChange={e => { onChangeIpAddressText(e.detail) }} type='text' placeholder='127.0.0.1:8000'></IonInput>
            </IonItem>
          </IonRow>

          <IonRow className='login-box'>
            <IonButton expand="block" fill="outline" color={'black'} disabled={disableBtn} onClick={onClickLogInBtn}>
              LOGIN
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
