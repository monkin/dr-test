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
    spinButton
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
    selectIsWinningTime
} from "./state";
import { startRoundAction } from "./state/branches";

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
                isWinningTime = map(state)(selectIsWinningTime);
            
            const randomSymbol = () => allSybols[Math.floor(Math.random() * allSybols.length)],
                startRound = () => {
                    store.dispatch(startRoundAction(Date.now(), [
                        randomSymbol(),
                        randomSymbol(),
                        randomSymbol()
                    ]));
                };

            return group(
                camera(scene),
                lights(scene),
                glow(scene),
                sceneLoader(scene, meshes => group(
                    paytable(scene, {
                        mesh: meshes[MeshName.PayoutsPanel],
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel1],
                        previousSymbol: map(previousSymbols)(row => row[0]),
                        currenSymbol: map(firstRow)(row => row[0]),
                        highlightedSymbol: map(combination)(c => c ? c.symbols[0] : null),
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration),
                        glow: isWinningTime,
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel2],
                        previousSymbol: map(previousSymbols)(row => row[1]),
                        currenSymbol: map(firstRow)(row => row[1]),
                        highlightedSymbol: map(combination)(c => c ? c.symbols[1] : null),
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration + stopDelay),
                        glow: isWinningTime,
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel3],
                        previousSymbol: map(previousSymbols)(row => row[2]),
                        currenSymbol: map(firstRow)(row => row[2]),
                        highlightedSymbol: map(combination)(c => c ? c.symbols[2] : null),
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration + stopDelay * 2),
                        glow: isWinningTime,
                    }),
                    spinButton(scene, {
                        active: map(time, roundEndTime)((time, endTime) => time > endTime),
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
