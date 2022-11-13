import axios from "axios";
import { APIUrl } from "../consts/APIUrl.const";
import { LogInModel } from "../models/LogIn.model";
import { TargetSiteModel } from "../models/TargetSite.model";

export const TargetSitesService = () => {

    const base64ToFile = (base64Str: string, name: string): File => {
        let bin: string = atob(base64Str.replace("/^.*,/", ''));
        let buffer: Uint8Array = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }

        return new File([buffer.buffer], name, { type: "image/png" });
    }

    /**
     * TargetSiteの全てのIDを取得する
     * @param loginModel 
     * @returns 
     */
    const fetchAllTargetSite = async (loginModel: LogInModel): Promise<TargetSiteModel[]> => {
        //TODO APIの結果をts用のモデルに変換する必要あり
        const response = await axios.get(loginModel.IPAddress + APIUrl.FETCH_ALL_SITE_ID);
        const json: any = response?.data;
        if (json?.return_code === 0) {
            let list: TargetSiteModel[] = [];
            for (let target_site in json?.target_site_list) {
                list.push({
                    SiteId: Number.parseInt(target_site?.site_id);
                })
            }

        } else {
            return [];
        }
    };

    /**
     * ターゲットサイトの初期画像を送信する
     * @param loginModel 
     * @param imageStr base64形式のターゲットサイトの画像
     * @returns サイトのid
     */
    const uploadInitialTargetSiteImage = async (loginModel: LogInModel, imageStr: string): Promise<TargetSiteModel> => {
        const response = await axios.post(loginModel.IPAddress, base64ToFile(imageStr, "sample.png"));
        const json: any = response.data;

        return { SiteId: 5 };
    };

    /**
     * 射撃後のターゲットサイトの画像を送信する
     * @param loginModek 
     * @param siteId 
     * @param imageStr 
     */
    const uploadShootedTargetSiteImage = async (loginModel: LogInModel, targetSite: TargetSiteModel, imageStr: string) => {
        const response = await axios.post(loginModel.IPAddress, { "data": targetSite.SiteId, "image": imageStr });
        const json: any = response.data;
    }

    return { fetchAllTargetSite, uploadInitialTargetSiteImage, uploadShootedTargetSiteImage };
}