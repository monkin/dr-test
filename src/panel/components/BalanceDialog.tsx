import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormHelperText,
} from "@material-ui/core";

export interface BalanceDialogProps {
    isOpen: boolean;
    balance: number;
    onClose: () => void;
    onChangeBalance: (balance: number) => void;
}

export function BalanceDialog({ isOpen, balance: initialBalance, onClose, onChangeBalance }: BalanceDialogProps) {
    const [balance, setBalance] = React.useState(initialBalance.toFixed(0));
    const handleSetBalanceClick = React.useCallback(() => {
        onChangeBalance(parseInt(balance, 10));
        onClose();
    }, [onChangeBalance, balance]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        setBalance(e.target.value);
    };

    React.useEffect(() => {
        if (isOpen) {
            setBalance(initialBalance.toFixed(0));
        }
    }, [isOpen]);

    const isValid = /^\d+$/.test(balance)
        && parseInt(balance, 10) <= 5000
        && parseInt(balance, 10) > 0;

    return <Dialog
        open={isOpen}
        onClose={onClose}
    >
        <DialogTitle id="alert-dialog-title">Update Balance</DialogTitle>
        <DialogContent>
            <TextField
                value={balance}
                onInput={handleChange}
                error={!isValid}
                fullWidth={true}
            />
            <FormHelperText>Balance should be an integer in range from 1 to 5000</FormHelperText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                Close
            </Button>
            <Button
                onClick={handleSetBalanceClick}
                disabled={!isValid}
                color="primary"
            >
                Set Balance
            </Button>
        </DialogActions>
    </Dialog>;
}