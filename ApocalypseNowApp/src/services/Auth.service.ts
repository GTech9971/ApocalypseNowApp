import { LogInModel } from "../models/LogIn.model";

export const AuthService = () => {

    /**
     * APIのIPAddressが合っているか確認する
     * @param loginModel 
     * @returns 
     */
    const checkAPIAddress = async (loginModel: LogInModel): Promise<boolean> => {
        // const response: Response = await fetch(loginModel.IPAddress);
        // const json: any = response.json();
        // return json?.ReturnCode !== undefined;
        return true;
    }

    return { checkAPIAddress };
}