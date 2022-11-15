import { Point } from "./Point.data";

/**
 * ヒットポイントデータ
 */
export interface TargetHitPointData {
    site_id: number;
    pt: Point;
    hit_point: number;
    created_at: string;
}
