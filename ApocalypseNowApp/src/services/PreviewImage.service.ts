import axios from "axios";
import { APIUrl } from "../consts/APIUrl.const";
import { BaseResponse } from "../data/Base.response";

/** プレビュー画像に関するサービス */
export const PreviewImageService = () => {

    const base64ToFile = (base64Str: string, name: string): File => {
        let bin: string = atob(base64Str);
        let buffer: Uint8Array = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }

        return new File([buffer.buffer], name, { type: "image/jpg" });
    }

    /**
     * プレビュー画像をアップロードする
     * @param imageStr 
     * @returns 
     */
    const uploadPreviewImage = async (imageStr: string): Promise<BaseResponse> => {
        const params: FormData = new FormData();
        params.append("file", base64ToFile(imageStr, "preview-image.jpg"));
        const response: BaseResponse = (await axios.post<BaseResponse>(APIUrl.UPLOAD_PREVIEW_IMAGE, params))?.data;
        return response;
    }


    /**
     * プレビュー画像を取得する
     * @returns 
     */
    const fetchPreviewImage = async (): Promise<string> => {
        // キャッシュ対策用
        const time: number = new Date().getTime();
        const response = await axios.get(APIUrl.FETCH_PREVIEW_IMAGE + "?time=" + time, { responseType: 'blob' });
        return URL.createObjectURL(response?.data);
    }

    return { uploadPreviewImage, fetchPreviewImage }
}