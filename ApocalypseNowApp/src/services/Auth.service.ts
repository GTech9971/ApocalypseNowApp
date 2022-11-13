import axios from "axios";
import { LogInModel } from "../models/LogIn.model";

export const AuthService = () => {

    /**
     * APIのIPAddressが合っているか確認する
     * @param loginModel 
     * @returns 
     */
    const checkAPIAddress = async (loginModel: LogInModel): Promise<boolean> => {
        // const response = await axios.get(loginModel.IPAddress);
        // const json: any = response.data;
        // return json?.ReturnCode !== undefined;
        return true;
    }

    return { checkAPIAddress };
}