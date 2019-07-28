export enum ReelSymbol {
    BARx3 = "BARx3",
    BAR = "BAR",
    BARx2 = "BARx2",
    Seven = "Seven",
    Cherry = "Cherry"
}

export type SymbolsRow = [ReelSymbol, ReelSymbol, ReelSymbol];

export const reelContent = [
    ReelSymbol.BARx3,
    ReelSymbol.BAR,
    ReelSymbol.BARx2,
    ReelSymbol.Seven,
    ReelSymbol.Cherry
];

export function nextSymbol(symbol: ReelSymbol) {
    return reelContent[(reelContent.indexOf(symbol) + 1) % reelContent.length];
}

export function previousSymbol(symbol: ReelSymbol) {
    return reelContent[(reelContent.indexOf(symbol) - 1 + reelContent.length) % reelContent.length];
}

export interface GameRound {
    startTime: number;
    /**
     * Top line content
     */
    currentSymbols: SymbolsRow;
    previousSymbols: SymbolsRow;
}

export interface GameState {
    time: number;
    round: GameRound;
}
