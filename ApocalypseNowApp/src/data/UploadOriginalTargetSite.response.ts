import { BaseResponse } from "./Base.response";
import { TargetSiteData } from "./TargetSite.data";

/**
 * 初回ターゲットサイトアップロードAPIのレスポンス
 */
export interface UploadOriginalTargetSiteResponse extends BaseResponse {
    /** ターゲットサイトのデータ */
    target_site: TargetSiteData;
}