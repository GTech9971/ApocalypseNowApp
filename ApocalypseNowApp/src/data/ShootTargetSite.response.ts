import { BaseResponse } from "./Base.response";
import { TargetHitPointData } from "./TargetHitPoint.data";

/**
 * 射撃後の画像アップロードAPIのレスポンス
 */
export interface ShootTargetSiteResponse extends BaseResponse {
    site_id: number;
    hit_point_list: TargetHitPointData[];
}