import { createAction, createReducer, ActionType } from "typesafe-actions";

export const setBalanceAction = createAction("balance/set", action => {
    return (value: number) => action(value);
});

export const addBalanceAction = createAction("balance/add", action => {
    return (value: number) => action(value);
});

interface ActionMap {
    setBalanceAction: typeof setBalanceAction,
    addBalanceAction: typeof addBalanceAction,
}

export const balanceReducer = createReducer<number, ActionType<ActionMap>>(0)
    .handleAction(setBalanceAction, (_, { payload }) => payload)
    .handleAction(addBalanceAction, (state, { payload }) => state + payload);