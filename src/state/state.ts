export enum ReelSymbol {
    BARx3 = "BARx3",
    BAR = "BAR",
    BARx2 = "BARx2",
    Seven = "Seven",
    Cherry = "Cherry"
}

export type SymbolsRow = [ReelSymbol, ReelSymbol, ReelSymbol];

export const allSybols = [
    ReelSymbol.BARx3,
    ReelSymbol.BAR,
    ReelSymbol.BARx2,
    ReelSymbol.Seven,
    ReelSymbol.Cherry
];

export function nextSymbol(symbol: ReelSymbol) {
    return allSybols[(allSybols.indexOf(symbol) + 1) % allSybols.length];
}

export function previousSymbol(symbol: ReelSymbol) {
    return allSybols[(allSybols.indexOf(symbol) - 1 + allSybols.length) % allSybols.length];
}

export enum Combination {
    Cherry1Row = "Cherry1row",
    Cherry2Row = "Cherry2row",
    Cherry3Row = "Cherry3row",
    SevenRow = "SevenRow",
    SevenOrCherryRow = "SevenOrCherryRow",
    BARx3Row = "BARx3Row",
    BARx2Row = "BARx2Row",
    BARRow = "BARRow",
    AnyBARRow = "AnyBARRow"
}

export const combinationPayout = {
    [Combination.Cherry3Row]: 4000,
    [Combination.Cherry1Row]: 2000,
    [Combination.Cherry2Row]: 1000,
    [Combination.SevenRow]: 150,
    [Combination.SevenOrCherryRow]: 75,
    [Combination.BARx3Row]: 50,
    [Combination.BARx2Row]: 20,
    [Combination.BARRow]: 10,
    [Combination.AnyBARRow]: 5
};

export const allCombinations = [
    Combination.Cherry3Row,
    Combination.Cherry1Row,
    Combination.Cherry2Row,
    Combination.SevenRow,
    Combination.SevenOrCherryRow,
    Combination.BARx3Row,
    Combination.BARx2Row,
    Combination.BARRow,
    Combination.AnyBARRow
];

export const combinationTest = {
    [Combination.Cherry3Row]: (row: SymbolsRow, i: number) => {
        return i === 2 && row.every(s => s === ReelSymbol.Cherry);
    },
    [Combination.Cherry1Row]: (row: SymbolsRow, i: number) => {
        return i === 0 && row.every(s => s === ReelSymbol.Cherry);
    },
    [Combination.Cherry2Row]: (row: SymbolsRow, i: number) => {
        return i === 1 && row.every(s => s === ReelSymbol.Cherry);
    },
    [Combination.SevenRow]: (row: SymbolsRow, _: number) => {
        return row.every(s => s === ReelSymbol.Seven);
    },
    [Combination.SevenOrCherryRow]: (row: SymbolsRow, _: number) => {
        return row.every(s => s === ReelSymbol.Seven || s === ReelSymbol.Cherry);
    },
    [Combination.BARx3Row]: (row: SymbolsRow, _: number) => {
        return row.every(s => s === ReelSymbol.BARx3);
    },
    [Combination.BARx2Row]: (row: SymbolsRow, _: number) => {
        return row.every(s => s === ReelSymbol.BARx2);
    },
    [Combination.BARRow]: (row: SymbolsRow, _: number) => {
        return row.every(s => s === ReelSymbol.BAR);
    },
    [Combination.AnyBARRow]: (row: SymbolsRow, _: number) => {
        return row.every(s => s === ReelSymbol.BAR || s === ReelSymbol.BARx2 || s === ReelSymbol.BARx3);
    }
};

export interface WinningCombination {
    row: number;
    combination: Combination;
    symbols: SymbolsRow;
    amount: number;
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
