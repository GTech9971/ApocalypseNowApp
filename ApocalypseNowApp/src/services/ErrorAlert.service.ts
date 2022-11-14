import { useIonAlert } from "@ionic/react";
import { BaseResponse } from "../data/Base.response"

export const ErrorAlertService = () => {
    const [presentAlert] = useIonAlert();

    const showAlert = async (baseResponse: BaseResponse, subMessage: string | undefined) => {
        await presentAlert({
            header: '接続エラー',
            subHeader: subMessage,
            message: baseResponse.message
        });
    }

    const showErrorAlert = async (e: unknown, subMessage: string | undefined) => {
        let message: string = "";
        console.error(e);
        if (e instanceof Error) { message = e.message; }
        await presentAlert({
            header: '接続エラー',
            subHeader: subMessage,
            message: message
        });
    }

    return { showAlert, showErrorAlert };
}