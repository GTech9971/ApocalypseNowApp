export class APIUrl {
    /** 認証 */
    public static readonly AUTH: string = "/auth";
    /** プレビュー画像をアップロードする */
    public static readonly UPLOAD_PREVIEW_IMAGE: string = "/upload_preview_image";
    /** プレビュー画像をダウンロードする */
    public static readonly FETCH_PREVIEW_IMAGE: string = "/fetch_preview_image";

    /** すべてのサイトのidを取得するAPI */
    public static readonly FETCH_ALL_SITE_ID: string = "/fetch_all_target_site";

    /** 新規ターゲットサイトアップロードAPI */
    public static readonly UPLOAD_ORIGINAL_TARGET_SITE: string = "/upload_original_target_site";
    /** 射撃後の画像アップロードAPI */
    public static readonly SHOOT_TARGET_SITE: string = "/shoot_target_site";
}