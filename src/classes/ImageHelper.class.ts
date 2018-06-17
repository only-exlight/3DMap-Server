export class ImgHelper {
    static elevationToColor(minElev: number, maxElev: number, elev) {
        const diapason: number = (maxElev - minElev) * 100000;
        const k = 256 / diapason;
        return Math.round((elev - minElev) / k);
    }

    static getImgWidth(startX: number, endX: number): number {
        return Math.round((endX - startX) * 100000);
    }

    static getImgHeigth(startY: number, endY: number): number {
        return Math.round((endY - startY) * 100000);
    }

    static xPositionPixel(minX: number, x: number): number {
        return Math.round((x - minX) * 100000);
    }

    static yPositionPixel(minY: number, y: number): number {
        return Math.round((y - minY) * 100000);
    }
 }