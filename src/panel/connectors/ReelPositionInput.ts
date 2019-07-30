import { connect } from "react-redux";
import {
    ReelNumber,
    GameState,
    GameMode,
    ReelSymbol,
    RowNumber,
    selectPredefinedReelsPosition,
    selectGameMode,
    setReelSymbolAction,
    setReelRowAction,
} from "../../state";
import { ReelPositionInput } from "../components";

export const ReelPositionInputConnected = connect(
    (state: GameState, { reel }: { reel: ReelNumber }) => {
        const position = selectPredefinedReelsPosition(state)[reel];
        return {
            symbol: position.symbol,
            row: position.row,
            disabled: selectGameMode(state) === GameMode.Random,
        };
    },
    dispatch => ({
        onSymbolChange: (reel: ReelNumber, symbol: ReelSymbol) => {
            dispatch(setReelSymbolAction(reel, symbol));
        },
        onRowChange: (reel: ReelNumber, row: RowNumber) => {
            dispatch(setReelRowAction(reel, row));
        },
    }),
)(ReelPositionInput);
