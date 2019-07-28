import lightmap from "./lightmap.png";
import BAR from "./BAR.png";
import BARx2 from "./2xBAR.png";
import BARx3 from "./3xBAR.png";
import Seven from "./7.png";
import Cherry from "./Cherry.png";
import { ReelSymbol } from "../../../state";

export const lightmapImage = lightmap;
export const symbolImageMap = {
    [ReelSymbol.BAR]: BAR,
    [ReelSymbol.BARx2]: BARx2,
    [ReelSymbol.BARx3]: BARx3,
    [ReelSymbol.Seven]: Seven,
    [ReelSymbol.Cherry]: Cherry
};

export const symbolImageSize = {
    width: 141,
    height: 121
};