/**
 * ターゲットサイトのデータ
 */
export interface TargetSiteData {
    /** サイトid */
    site_id: number;
    /** 画像パス */
    img_path: string;
    /** トリミング座標x */
    trim_x: number;
    /** トリミング座標y */
    trim_y: number;
    /** トリミング座標w */
    trim_w: number;
    /** トリミング座標h */
    trim_h: number;
    /** 作成日 */
    created_at: string;
    /** ヒット後の画像のパス */
    hit_img_path: string;
    /** 更新日 */
    updated_at: string;
}