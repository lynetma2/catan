import {Hex} from "./Hex.ts";
import {DoubledCoord} from "./DoubleCoord.ts";

export class OffsetCoord {

    public static EVEN: number = 1;
    public static ODD: number = -1;
    public col:number;
    public row:number;

    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    }

    public static qoffsetFromCube(offset: number, h: Hex): OffsetCoord {
        const parity: number = h.q & 1;
        const col: number = h.q;
        const row: number = h.r + (h.q + offset * parity) / 2;
        if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
            throw "offset must be EVEN (+1) or ODD (-1)";
        }
        return new OffsetCoord(col, row);
    }

    public static qoffsetToCube(offset: number, h: OffsetCoord): Hex {
        const parity: number = h.col & 1;
        const q: number = h.col;
        const r: number = h.row - (h.col + offset * parity) / 2;
        const s: number = -q - r;
        if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
            throw "offset must be EVEN (+1) or ODD (-1)";
        }
        return new Hex(q, r, s);
    }

    public static roffsetFromCube(offset: number, h: Hex): OffsetCoord {
        const parity: number = h.r & 1;
        const col: number = h.q + (h.r + offset * parity) / 2;
        const row: number = h.r;
        if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
            throw "offset must be EVEN (+1) or ODD (-1)";
        }
        return new OffsetCoord(col, row);
    }

    public static roffsetToCube(offset: number, h: OffsetCoord): Hex {
        const parity: number = h.row & 1;
        const q: number = h.col - (h.row + offset * parity) / 2;
        const r: number = h.row;
        const s: number = -q - r;
        if (offset !== OffsetCoord.EVEN && offset !== OffsetCoord.ODD) {
            throw "offset must be EVEN (+1) or ODD (-1)";
        }
        return new Hex(q, r, s);
    }

    public static qoffsetFromQdoubled(offset: number, h: DoubledCoord): OffsetCoord {
        const parity: number = h.col & 1;
        return new OffsetCoord(h.col, (h.row + offset * parity) / 2);
    }

    public static qoffsetToQdoubled(offset: number, h: OffsetCoord): DoubledCoord {
        const parity: number = h.col & 1;
        return new DoubledCoord(h.col, 2 * h.row - offset * parity);
    }

    public static roffsetFromRdoubled(offset: number, h: DoubledCoord): OffsetCoord {
        const parity: number = h.row & 1;
        return new OffsetCoord((h.col + offset * parity) / 2, h.row);
    }

    public static roffsetToRdoubled(offset: number, h: OffsetCoord): DoubledCoord {
        const parity: number = h.row & 1;
        return new DoubledCoord(2 * h.col - offset * parity, h.row);
    }

}