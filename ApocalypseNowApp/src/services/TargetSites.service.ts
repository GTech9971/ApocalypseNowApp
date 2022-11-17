import axios from "axios";
import { APIUrl } from "../consts/APIUrl.const";
import { FetchAllTargetSiteResponse } from "../data/FetchAllTargetSite.response";
import { LogInData } from "../data/LogIn.data";
import { ShootTargetSiteResponse } from "../data/ShootTargetSite.response";
import { TargetSiteData } from "../data/TargetSite.data";
import { UploadOriginalTargetSiteResponse } from "../data/UploadOriginalTargetSite.response";

/**
 * ターゲットサイトAPIのサービス
 * @returns 
 */
export const TargetSitesService = () => {

    const base64ToFile = (base64Str: string, name: string): File => {
        let bin: string = atob(base64Str);
        let buffer: Uint8Array = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }

        return new File([buffer.buffer], name, { type: "image/png" });
    }

    /**
     * TargetSiteの全てのIDを取得する
     * @param loginData
     * @returns 
     */
    const fetchAllTargetSite = async (loginData: LogInData): Promise<FetchAllTargetSiteResponse> => {
        const response: FetchAllTargetSiteResponse = (await axios.get<FetchAllTargetSiteResponse>(APIUrl.FETCH_ALL_SITE_ID))?.data;
        return response;
    };

    /**
     * ターゲットサイトの初期画像を送信する
     * @param loginData
     * @param imageStr base64形式のターゲットサイトの画像
     * @param fileName
     * @returns サイトのid
     */
    const uploadInitialTargetSiteImage = async (loginData: LogInData, imageStr: string, fileName: string): Promise<UploadOriginalTargetSiteResponse> => {
        const params: FormData = new FormData();
        params.append("file", base64ToFile(imageStr, fileName));
        // headersのcontent-typeの指定は不要。ライブラリが勝手にいい感じに設定してくれる
        const response: UploadOriginalTargetSiteResponse = (await axios.post<UploadOriginalTargetSiteResponse>(
            APIUrl.UPLOAD_ORIGINAL_TARGET_SITE,
            params,
        ))?.data;

        return response;
    };

    /**
     * 射撃後のターゲットサイトの画像を送信する
     * @param loginData
     * @param site_id
     * @param imageStr 
    */
    const shootTargetSite = async (loginData: LogInData, siteId: number, imageStr: string, fileName: string): Promise<ShootTargetSiteResponse> => {
        const params: FormData = new FormData();
        params.append("file", base64ToFile(imageStr, fileName));
        // headersのcontent-typeの指定は不要。ライブラリが勝手にいい感じに設定してくれる
        const response: ShootTargetSiteResponse = (await axios.post<ShootTargetSiteResponse>(
            APIUrl.UPLOAD_ORIGINAL_TARGET_SITE + "?site_id=" + siteId,
            params,
        ))?.data;

        return response;
    }


    const createTargetSiteModel = (site_id: number): TargetSiteData => {
        return {
            site_id: site_id,
            img_path: "",
            hit_img_path: "",
            trim_x: 0,
            trim_y: 0,
            trim_w: 0,
            trim_h: 0,
            created_at: "",
            updated_at: "",
        }
    }

    return { fetchAllTargetSite, uploadInitialTargetSiteImage, shootTargetSite, createTargetSiteModel };
}