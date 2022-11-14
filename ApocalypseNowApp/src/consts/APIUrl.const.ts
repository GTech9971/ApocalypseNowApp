export class APIUrl {
    public static readonly AUTH: string = "/auth";

    /** すべてのサイトのidを取得するAPI */
    public static readonly FETCH_ALL_SITE_ID: string = "/fetch_all_target_site";

    /** 新規ターゲットサイトアップロードAPI */
    public static readonly UPLOAD_ORIGINAL_TARGET_SITE: string = "/upload_original_target_site";
    /** 射撃後の画像アップロードAPI */
    public static readonly SHOOT_TARGET_SITE: string = "/shoot_target_site";
}