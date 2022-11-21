import axios from "axios"
import { APIUrl } from "../consts/APIUrl.const"
import { BaseResponse } from "../data/Base.response"
import { FetchCommandsResponse } from "../data/FetchCommands.response"

/**
 * SiteCommandsAPIのサービス
 */
export const SiteCommandsService = () => {

    /**
     * コマンド実行する
     * @param site_id サイトID
     * @param command_id コマンドID
     * @returns 
     */
    const doCommand = async (site_id: number, command_id: number): Promise<BaseResponse> => {
        const response: BaseResponse = (await axios.post<BaseResponse>(APIUrl.DO_COMMAND + `?site_id=${site_id}&command_id=${command_id}`))?.data;
        return response;
    }

    /**
     * サイトIDに紐ずくサイトコマンドリストを取得する
     * @param site_id サイトID
     * @returns サイトコマンドリスト
     */
    const fetchCommands = async (site_id: number): Promise<FetchCommandsResponse> => {
        const response: FetchCommandsResponse = (await axios.post<FetchCommandsResponse>(APIUrl.FETCH_COMMANDS + `?site_id=${site_id}`))?.data;
        return response;
    }

    /**
     * サイトコマンドを完了する
     * @param site_command_id サイトコマンドID
     * @returns 
     */
    const doneCommand = async (site_command_id: number): Promise<BaseResponse> => {
        const response: BaseResponse = (await axios.post<BaseResponse>(APIUrl.DONE_COMMAND + `?site_command_id=${site_command_id}`))?.data;
        return response;
    }

    return { doCommand, fetchCommands, doneCommand }
}