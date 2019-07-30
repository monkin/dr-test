import { connect } from "react-redux";
import { GameModeInput } from "../components";
import { GameState, selectGameMode, GameMode, setGameModeAction } from "../../state";

export const GameModeInputConnected = connect(
    (state: GameState) => ({
        mode: selectGameMode(state),
    }),
    dispatch => ({
        onChange: (mode: GameMode) => {
            dispatch(setGameModeAction(mode));
        },
    }),
)(GameModeInput);
