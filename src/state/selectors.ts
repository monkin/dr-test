import { createSelector } from "reselect";
import {
    GameState,
    nextSymbol,
    SymbolsRow
} from "./state";

export function selectTime(state: GameState) {
    return state.time;
}
export function selectRound(state: GameState) {
    return state.round;
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