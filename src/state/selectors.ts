import { createSelector } from "reselect";
import {
    GameState,
    nextSymbol,
    SymbolsRow,
    allCombinations,
    combinationTest,
    WinningCombination,
    combinationPayout,
    spinPrice,
    previousSymbol
} from "./state";
import { spiningDuration, stopDelay, winningDuration } from "./timing";

export function selectTime(state: GameState) {
    return state.time;
}
export function selectRound(state: GameState) {
    return state.round;
}
export function selectBalance(state: GameState) {
    return state.balance;
}

export function selectGameMode(state: GameState) {
    return state.settings.mode;
}

export function selectIsBalanceDialogOpen(state: GameState) {
    return state.settings.isBalanceDialogOpen;
}

export function selectPredefinedReelsPosition(state: GameState) {
    return state.settings.reelsPosition;
}

export const selectRoundStartTime = createSelector(selectRound, round => round.startTime);
export const selectPreviousSymbols = createSelector(selectRound, round => round.previousSymbols);

export const selectFirstRow = createSelector(selectRound, round => round.currentSymbols);
export const selectSecondRow = createSelector(selectFirstRow, row => {
    return row.map(nextSymbol) as SymbolsRow;
});
export const selectThirdRow = createSelector(selectSecondRow, row => {
    return row.map(nextSymbol) as SymbolsRow;
});
export const selectRows = createSelector(selectFirstRow, selectSecondRow, selectThirdRow, (row1, row2, row3) => [row1, row2, row3]);

export const selectWinningCombination = createSelector(selectRows, (rows): WinningCombination | null => {
    for (let combination of allCombinations) {
        let test = combinationTest[combination];
        for (let i = 0; i < rows.length; i++) {
            if (test(rows[i], i)) {
                return {
                    combination,
                    row: i,
                    symbols: rows[i],
                    amount: combinationPayout[combination],
                };
            }
        }
    }
    return null;
});

export const selectRoundEndTime = createSelector(selectRoundStartTime, selectWinningCombination, (startTime, winning) => {
    return startTime + spiningDuration + stopDelay * 2 + (winning ? winningDuration : 0);
});

export const selectIsWinningTime = createSelector(
    selectRoundStartTime,
    selectRoundEndTime,
    selectTime,
    (roundStartTime, roundEndTime, time) => {
        return (time > roundStartTime + spiningDuration + stopDelay * 2) && (time < roundEndTime);
    }
);

export const selectIsRoundFinished = createSelector(
    selectRoundEndTime, selectTime,
    (endTime, time) => time > endTime
);

export const selectCanStartNewRound = createSelector(
    selectIsRoundFinished, selectBalance,
    (finished, balance) => finished && balance >= spinPrice,
);

export const selectPredefinedTopRowSymbols = createSelector(
    selectPredefinedReelsPosition,
    (positions) => {
        return positions.map(({ symbol, row }) => {
            let result = symbol;
            for (let i = 0; i < row; i++) {
                result = previousSymbol(result);
            }
            return result;
        }) as SymbolsRow;
    },
);
