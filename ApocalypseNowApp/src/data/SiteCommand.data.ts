
/**
 * コマンドデータ
 */
export interface SiteCommandData {
    /** サイトコマンドID */
    id: number;
    /** サイトID */
    site_id: number;
    /** コマンドID */
    command_id: number;
    /** 作成日時 */
    created_at: string;
}