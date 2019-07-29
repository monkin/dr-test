import { createStore, combineReducers, Store, AnyAction } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension/logOnly";
import { GameState } from "./state";
import { roundReducer, balanceReducer } from "./branches";

export function createGameStore() {
    return createStore<GameState, AnyAction, {}, {}>(
        combineReducers({
            round: roundReducer,
            balance: balanceReducer,
            time: () => 0,
        }),
        undefined,
        devToolsEnhancer({ name: "Spin&Win" })
    );
}
