import { atom } from "recoil";
import { LogInModel } from "../models/LogIn.model";

/**
 * ログイン情報のステート
 */
export const logInModelState = atom<LogInModel>({
    key: 'loginModelState',
    default: undefined,
});