import "babel-core/register";
import "babel-polyfill";
import "pepjs";
import "babylonjs-loaders";

import { Engine, Scene } from "babylonjs";
import { group, cache, map } from "rebylon";
import {
    camera,
    sceneLoader,
    lights,
    reel,
    MeshName,
    border,
    glow,
    body,
    paytable,
    spinButton,
    balance
} from "./game";
import {
    createGameStore,
    selectFirstRow,
    selectPreviousSymbols,
    selectRoundStartTime,
    spiningDuration,
    stopDelay,
    allSybols,
    selectRoundEndTime,
    selectWinningCombination,
    selectTime,
    selectIsWinningTime,
    startRoundAction,
    setBalanceAction,
    selectBalance,
    addBalanceAction,
    spinPrice
} from "./state";

window.addEventListener("DOMContentLoaded", () => {
    const store = createGameStore(),
        canvas = document.getElementById("canvas") as HTMLCanvasElement,
        engine = new Engine(canvas, true, {
            antialias: true,
            preserveDrawingBuffer: true
        }),
        scene = new Scene(engine),
        app = cache(() => ({ ...store.getState(), time: Date.now() }))(state => {
            const previousSymbols = map(state)(selectPreviousSymbols),
                firstRow = map(state)(selectFirstRow),
                roundStartTime = map(state)(selectRoundStartTime),
                roundEndTime = map(state)(selectRoundEndTime),
                time = map(state)(selectTime),
                combination = map(state)(selectWinningCombination),
                isWinningTime = map(state)(selectIsWinningTime),
                userBalance = map(state)(selectBalance);
            
            const randomSymbol = () => allSybols[Math.floor(Math.random() * allSybols.length)],
                startRound = () => {
                    store.dispatch(addBalanceAction(-spinPrice));
                    store.dispatch(startRoundAction(Date.now(), [
                        randomSymbol(),
                        randomSymbol(),
                        randomSymbol()
                    ]));
                    const combination = selectWinningCombination(store.getState());
                    if (combination) {
                        setTimeout(() => {
                            store.dispatch(addBalanceAction(combination.amount));
                        }, spiningDuration + stopDelay * 2);
                    }
                };

            return group(
                camera(scene),
                lights(scene),
                glow(scene),
                sceneLoader(scene, meshes => group(
                    balance(scene, {
                        time,
                        mesh: meshes[MeshName.Balance],
                        balance: userBalance,
                        clickable: true,
                        onClick: () => { console.log("balance click") }
                    }),
                    paytable(scene, {
                        time,
                        mesh: meshes[MeshName.PayoutsPanel],
                        winningCombination: map(combination)(c => c ? c.combination : null),
                        highlightWinningCombination: isWinningTime
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel1],
                        previousSymbol: map(previousSymbols)(row => row[0]),
                        currenSymbol: map(firstRow)(row => row[0]),
                        winningSymbol: map(combination)(c => c ? c.symbols[0] : null),
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration),
                        highlightWinningSymbol: isWinningTime,
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel2],
                        previousSymbol: map(previousSymbols)(row => row[1]),
                        currenSymbol: map(firstRow)(row => row[1]),
                        winningSymbol: map(combination)(c => c ? c.symbols[1] : null),
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration + stopDelay),
                        highlightWinningSymbol: isWinningTime,
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel3],
                        previousSymbol: map(previousSymbols)(row => row[2]),
                        currenSymbol: map(firstRow)(row => row[2]),
                        winningSymbol: map(combination)(c => c ? c.symbols[2] : null),
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration + stopDelay * 2),
                        highlightWinningSymbol: isWinningTime,
                    }),
                    spinButton(scene, {
                        active: map(time, roundEndTime, userBalance)((time, endTime, balance) => time > endTime && balance >= spinPrice),
                        mesh: meshes[MeshName.SpinButton],
                        onClick: startRound,
                        time: time,
                    }),
                    border(scene, {
                        mesh: meshes[MeshName.MachineEdge],
                    }),
                    body(scene, {
                        mesh: meshes[MeshName.MachineBody],
                    }),
                    body(scene, {
                        mesh: meshes[MeshName.LeftBanner],
                    }),
                    body(scene, {
                        mesh: meshes[MeshName.RightBanner],
                    })
                )),
            );
        });
    
    store.dispatch(setBalanceAction(3000));

    function resize() {
        engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));
        engine.resize();
    }

    resize();

    window.addEventListener("resize", () => {
        resize();
        setTimeout(resize, 300);
    });

    engine.runRenderLoop(() => {
        app.update();
        scene.render();
    });
});
