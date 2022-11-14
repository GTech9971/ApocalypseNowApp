
export interface BaseResponse {
    return_code: ReturnCode;
    message: string;
}


export enum ReturnCode {
    Success = 0,
    Error = 1,
}