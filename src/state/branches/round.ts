import { createAction, createReducer, ActionType } from "typesafe-actions";
import { SymbolsRow, GameRound, ReelSymbol } from "../state";

export const startRoundAction = createAction("round/start", action => {
    return (time: number, symbols: SymbolsRow) => action({ time, symbols });
});

interface ActionsMap {
    startRound: typeof startRoundAction;
}

export const roundReducer = createReducer<GameRound, ActionType<ActionsMap>>({
    startTime: 0,
    currentSymbols: [ReelSymbol.Cherry, ReelSymbol.BAR, ReelSymbol.Seven],
    previousSymbols: [ReelSymbol.BARx3, ReelSymbol.BAR, ReelSymbol.BARx2],
}).handleAction(startRoundAction, (state, { payload: { time, symbols } }) => {
    return {
        startTime: time,
        currentSymbols: symbols,
        previousSymbols: state.previousSymbols,
    };
});