import { atom } from "recoil";
import { LogInData } from "../data/LogIn.data";


/**
 * ログイン情報のステート
 */
export const logInDataState = atom<LogInData>({
    key: 'loginDataState',
    default: undefined,
});