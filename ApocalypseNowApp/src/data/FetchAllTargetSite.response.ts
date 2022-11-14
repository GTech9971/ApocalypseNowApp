import { BaseResponse } from "./Base.response";
import { TargetSiteData } from "./TargetSite.data";

export interface FetchAllTargetSiteResponse extends BaseResponse {
    target_site_list: TargetSiteData[];
}