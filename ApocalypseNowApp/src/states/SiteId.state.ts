import { atom } from "recoil";


/**
 * ターゲットサイトIDのステート
 */
export const siteIdState = atom<number>({
    key: 'siteIdState',
    default: undefined,
});