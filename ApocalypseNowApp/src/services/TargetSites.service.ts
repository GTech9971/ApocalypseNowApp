import axios from "axios";
import { LogInModel } from "../models/LogIn.model";
import { TargetSiteModel } from "../models/TargetSite.model";

export const TargetSitesService = () => {

    /**
     * TargetSiteの全てのIDを取得する
     * @param loginModel 
     * @returns 
     */
    const fetchAllTargetSite = async (loginModel: LogInModel): Promise<TargetSiteModel[]> => {
        // const response = await axios.get(loginModel.IPAddress);
        // const json: any = response.data;

        return [{ SiteId: 1 }, { SiteId: 2 }, { SiteId: 3 }, { SiteId: 4 }];
    };

    /**
     * ターゲットサイトの初期画像を送信する
     * @param loginModel 
     * @param imageStr base64形式のターゲットサイトの画像
     * @returns サイトのid
     */
    const uploadInitialTargetSiteImage = async (loginModel: LogInModel, imageStr: string): Promise<TargetSiteModel> => {
        // const response = await axios.post(loginModel.IPAddress, { "data": imageStr });
        // const json: any = response.data;

        return { SiteId: 5 };
    };

    /**
     * 射撃後のターゲットサイトの画像を送信する
     * @param loginModek 
     * @param siteId 
     * @param imageStr 
     */
    const uploadShootedTargetSiteImage = async (loginModel: LogInModel, targetSite: TargetSiteModel, imageStr: string) => {
        // const response = await axios.post(loginModel.IPAddress, { "data": targetSite.SiteId, "image": imageStr });
        // const json: any = response.data;
    }

    return { fetchAllTargetSite, uploadInitialTargetSiteImage, uploadShootedTargetSiteImage };
}