import axios from "axios";
import { APIUrl } from "../consts/APIUrl.const";
import { BaseResponse } from "../data/Base.response";
import { LogInData } from "../data/LogIn.data";


export const AuthService = () => {

    /**
     * APIのIPAddressが合っているか確認する
     * @param loginData 
     * @returns 
     */
    const checkAPIAddress = async (loginData: LogInData): Promise<BaseResponse> => {
        const response: BaseResponse = (await axios.post<BaseResponse>(APIUrl.AUTH))?.data;
        return response;
    }

    return { checkAPIAddress };
}