import { connect } from "react-redux";
import { BalanceDialog } from "../components";
import {
    selectIsBalanceDialogOpen,
    selectBalance,
    GameState,
    closeBalanceDialogAction,
    setBalanceAction,
} from "../../state";

export const BalanceDialogConnected = connect(
    (state: GameState) => ({
        isOpen: selectIsBalanceDialogOpen(state),
        balance: selectBalance(state),
    }),
    dispatch => ({
        onClose: () => dispatch(closeBalanceDialogAction()),
        onChangeBalance: (balance: number) => dispatch(setBalanceAction(balance)),
    }),
)(BalanceDialog);
