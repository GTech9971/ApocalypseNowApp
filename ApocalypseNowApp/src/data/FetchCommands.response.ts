
import { BaseResponse } from "./Base.response";
import { SiteCommandData } from "./SiteCommand.data";

/**
 * fetch_commands APIのレスポンス
 */
export interface FetchCommandsResponse extends BaseResponse {
    command_list: SiteCommandData[];
}
