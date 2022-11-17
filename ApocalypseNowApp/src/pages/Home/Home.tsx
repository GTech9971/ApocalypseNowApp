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
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
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
import { memo, useEffect, useState } from 'react';
import { FetchAllTargetSiteResponse } from '../../data/FetchAllTargetSite.response';
import { TargetSitesService } from '../../services/TargetSites.service';
import { TargetSiteData } from '../../data/TargetSite.data';
import { siteIdState } from '../../states/SiteId.state';

const Home: React.FC<RouteComponentProps> = (props) => {

  const [loginData, setLogInData] = useRecoilState(logInDataState);
  const [isViewer, setIsViewer] = useState<boolean>(false);

  const [selectSiteId, setSelectSiteId] = useRecoilState(siteIdState);
  const [targetSiteList, setTargetSiteList] = useState<TargetSiteData[]>([]);

  const { checkAPIAddress } = AuthService();
  const { fetchAllTargetSite } = TargetSitesService();
  const { showAlert, showErrorAlert } = ErrorAlertService();

  /** 初回起動時にTargetSiteを取得する */
  useEffect(() => {
    (async () => {
      try {
        const response: FetchAllTargetSiteResponse = await fetchAllTargetSite(loginData);
        if (response.return_code === ReturnCode.Success) {
          setTargetSiteList(response.target_site_list);
        }
      } catch (e: unknown) {
        await showErrorAlert(e, "APIサーバーとの接続に失敗 ");
      }
    })();
  }, []);

  /** IPAddressの入力 */
  const onChangeIpAddressText = (e: InputChangeEventDetail) => {
    if (!e.value) { return; }
    const logInData: LogInData = { IPAddress: e.value as string };
    setLogInData(logInData);
  }

  /** SiteId選択時のイベント  */
  const onSelectTargetSite = (e: InputChangeEventDetail) => {
    if (!e.value) { return; }
    const siteId: number = Number.parseInt(e.value);
    setSelectSiteId(siteId);
  }



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

                  <IonList>
                    <IonItem>
                      <IonLabel>Viewerとしてログイン</IonLabel>
                      <IonCheckbox onIonChange={e => setIsViewer(e.detail.checked)}></IonCheckbox>
                    </IonItem>

                    <IonItem>
                      <IonLabel>SiteIDを選択</IonLabel>
                      <IonSelect onIonChange={e => onSelectTargetSite(e.detail.value)}>
                        {targetSiteList.map((data, index) => {
                          return (
                            <IonSelectOption key={index} value={data}>
                              {data.site_id}
                            </IonSelectOption>
                          )
                        })}
                      </IonSelect>
                    </IonItem>
                  </IonList>
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
          <IonButton expand="block" fill="outline" color={'black'} onClick={onClickLogInBtn}>
            LOGIN
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage >
  );
};

export default memo(Home);