import * as React from "react";
import { ReelSymbol, RowNumber, ReelNumber } from "../../state";
import {
    Select,
    MenuItem,
    InputLabel,
    makeStyles,
} from "@material-ui/core";

interface ReelPositionInputProps {
    label: string;
    reel: ReelNumber;
    symbol: ReelSymbol;
    row: RowNumber;
    disabled: boolean;
    onSymbolChange: (reel: ReelNumber, symbol: ReelSymbol) => void;
    onRowChange: (reel: ReelNumber, row: RowNumber) => void;
}

const useStyles = makeStyles(theme => ({
    label: {
        marginTop: theme.spacing(),
    },
    fieldsContainer: {
        display: "flex",
        marginBottom: theme.spacing(3),
    },
    symbolInput: {
        width: "55%",
        marginRight: theme.spacing()
    },
    rowInput: {
        width: "45%",
    }
}));

export function ReelPositionInput({ label, reel, symbol, row, disabled, onRowChange, onSymbolChange }: ReelPositionInputProps) {
    const handleSymbolChange = React.useCallback((e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        onSymbolChange(reel, e.target.value as ReelSymbol);
    }, [reel]);

    const handleRowChange = React.useCallback((e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        onRowChange(reel, e.target.value as RowNumber);
    }, [reel]);

    const styles = useStyles()

    return <>
        <InputLabel className={styles.label}>{label}</InputLabel>
        <div className={styles.fieldsContainer}>
            <Select
                disabled={disabled}
                className={styles.symbolInput}
                value={symbol}
                onChange={handleSymbolChange}
            >
                <MenuItem value={ReelSymbol.BARx3}>3xBAR</MenuItem>
                <MenuItem value={ReelSymbol.BAR}>BAR</MenuItem>
                <MenuItem value={ReelSymbol.BARx2}>2xBAR</MenuItem>
                <MenuItem value={ReelSymbol.Seven}>Seven</MenuItem>
                <MenuItem value={ReelSymbol.Cherry}>Cherry</MenuItem>
            </Select>
            <Select
                disabled={disabled}
                className={styles.rowInput}
                value={row}
                onChange={handleRowChange}
            >
                <MenuItem value={0}>First row</MenuItem>
                <MenuItem value={1}>Second row</MenuItem>
                <MenuItem value={2}>Third row</MenuItem>
            </Select>
        </div>
    </>;
}
