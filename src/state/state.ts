
export enum ReelSymbol {
    BARx3 = "BARx3",
    BAR = "BAR",
    BARx2 = "BARx2",
    Seven = "Seven",
    Cherry = "Cherry"
}

export const reelContent = [
    ReelSymbol.BARx3,
    ReelSymbol.BAR,
    ReelSymbol.BARx2,
    ReelSymbol.Seven,
    ReelSymbol.Cherry
];

export function nextSymbol(symbol: ReelSymbol) {
    return (reelContent.indexOf(symbol) + 1) % 5;
}

