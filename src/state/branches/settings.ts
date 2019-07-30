import {
    ActionType,
    createReducer,
    createAction
} from "typesafe-actions";
import {
    GameMode,
    ReelNumber,
    ReelSymbol,
    RowNumber,
    GameSettings,
    ReelPosition
} from "../state";

export const setGameModeAction = createAction("settings/setGameMode", action => {
    return (mode: GameMode) => action(mode);
});

export const setReelSymbolAction = createAction("settings/setReelSymbol", action => {
    return (reel: ReelNumber, symbol: ReelSymbol) => {
        return action({ reel, symbol });
    };
});

export const setReelRowAction = createAction("settings/setReelRow", action => {
    return (reel: ReelNumber, row: RowNumber) => {
        return action({ reel, row });
    };
});

export const openBalanceDialogAction = createAction("settings/openBalanceDialog");
export const closeBalanceDialogAction = createAction("settings/closeBalanceDialog");

interface ActionMap {
    setGameModeAction: typeof setGameModeAction;
    setReelSymbolAction: typeof setReelSymbolAction;
    setReelRowAction: typeof setReelRowAction;
    openBalanceDialogAction: typeof openBalanceDialogAction;
    closeBalanceDialogAction: typeof closeBalanceDialogAction;
}

export const settingsReducer = createReducer<GameSettings, ActionType<ActionMap>>({
    mode: GameMode.Random,
    isBalanceDialogOpen: false,
    reelsPosition: [
        { row: 1, symbol: ReelSymbol.Cherry },
        { row: 1, symbol: ReelSymbol.Cherry },
        { row: 1, symbol: ReelSymbol.Cherry },
    ],
}).handleAction(setGameModeAction, (state, { payload: mode }) => {
    return { ...state, mode };
}).handleAction(setReelSymbolAction, (state, { payload: { reel, symbol } }) => {
    return {
        ...state,
        reelsPosition: state.reelsPosition.map((position, i) => {
            if (i === reel) {
                return { symbol, row: position.row };
            } else {
                return position;
            }
        }) as [ReelPosition, ReelPosition, ReelPosition],
    };
}).handleAction(setReelRowAction, (state, { payload: { reel, row } }) => {
    return {
        ...state,
        reelsPosition: state.reelsPosition.map((position, i) => {
            if (i === reel) {
                return { symbol: position.symbol, row };
            } else {
                return position;
            }
        }) as [ReelPosition, ReelPosition, ReelPosition],
    };
}).handleAction(openBalanceDialogAction, state => {
    return { ...state, isBalanceDialogOpen: true };
}).handleAction(closeBalanceDialogAction, state => {
    return { ...state, isBalanceDialogOpen: false };
});
