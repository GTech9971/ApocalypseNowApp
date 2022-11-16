import {
  InputChangeEventDetail,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonImg,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Home.scss';

import headerlogo from "../../images/ap2n-header.png";
import { useRecoilState } from 'recoil';

import { AuthService } from '../../services/Auth.service';
import { RouteComponentProps } from 'react-router';
import { LogInData } from '../../data/LogIn.data';
import { logInDataState } from '../../states/LogIn.data.state';
import { BaseResponse, ReturnCode } from '../../data/Base.response';
import { ErrorAlertService } from '../../services/ErrorAlert.service';
import { useState } from 'react';

const Home: React.FC<RouteComponentProps> = (props) => {

  const [loginData, setLogInData] = useRecoilState(logInDataState);
  const [isViewer, setIsViewer] = useState<boolean>(false);

  /** IPAddressの入力 */
  const onChangeIpAddressText = (e: InputChangeEventDetail) => {
    if (!e.value) { return; }
    const logInData: LogInData = { IPAddress: e.value as string };
    setLogInData(logInData);
  }

  const { checkAPIAddress } = AuthService();
  const { showAlert, showErrorAlert } = ErrorAlertService();

  /** ログインボタン押下時 */
  const onClickLogInBtn = async () => {
    try {
      const response: BaseResponse = await checkAPIAddress(loginData);

      if (response.return_code === ReturnCode.Success) {
        //viewer
        if (isViewer) {
          props.history.push("/viewer");
        } else {
          //uploader
          props.history.push("/CameraUpload");
        }
      } else {
        await showAlert(response, "APIサーバーとの接続に失敗 ");
      }
    } catch (e: unknown) {
      await showErrorAlert(e, "APIサーバーとの接続に失敗 ");
    }

  }

  const disableBtn: boolean = false;

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

                <IonCardContent>
                  <IonCheckbox onIonChange={e => setIsViewer(e.detail.checked)}></IonCheckbox>
                  <IonLabel position='stacked'>Viewerとしてログイン</IonLabel>
                </IonCardContent>

                <IonCardSubtitle>
                  <IonText>
                    <ul>
                      <>
                        {isViewer && <li>Viwerとしてログインにチェックを入れると、カメラアップローダの操作側としてログインします。 </li>}
                      </>

                      <>
                        {isViewer === false && <li>Viwerとしてログインにチェックを入れなかった場合、サイトの画像をアップロードするカメラアップローダとしてログインします。</li>}
                      </>
                    </ul>
                  </IonText>
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          </IonRow>

        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar >
          <IonButton expand="block" fill="outline" color={'black'} disabled={disableBtn} onClick={onClickLogInBtn}>
            LOGIN
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
