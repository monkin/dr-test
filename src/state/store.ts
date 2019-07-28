import { createStore, combineReducers, Store } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension/logOnly";
import { GameState } from "./state";
import { roundReducer } from "./branches";

export function createGameStore(): Store<GameState> {
    return createStore(
        combineReducers({
            round: roundReducer,
            time: () => 0,
        }),
        undefined,
        devToolsEnhancer({ name: "Spin&Win" })
    );
}
