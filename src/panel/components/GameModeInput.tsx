import * as React from "react";
import { GameMode } from "../../state";
import {
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    makeStyles,
} from "@material-ui/core";

export interface GameModeInputProps {
    mode: GameMode;
    onChange: (mode: GameMode) => void;
}

const useStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        marginBottom: theme.spacing(),
    },
    item: {
        flexGrow: 1,
        marginRight: theme.spacing(),
    },
}));

export function GameModeInput({ mode, onChange }: GameModeInputProps) {
    const handleChange = React.useCallback((e: React.ChangeEvent<{}>, value: string) => {
        onChange(value as GameMode);
    }, [onChange]);

    const styles = useStyles();

    return <>
        <FormLabel>Game mode</FormLabel>
        <RadioGroup
            className={styles.group}
            value={mode}
            onChange={handleChange}
        >
            <FormControlLabel
                className={styles.item}
                value={GameMode.Random}
                control={<Radio/>}
                label="Random"
                labelPlacement="end"
            />
            <FormControlLabel
                className={styles.item}
                value={GameMode.Fixed}
                control={<Radio/>}
                label="Fixed"
                labelPlacement="end"
            />
        </RadioGroup>
    </>
}
