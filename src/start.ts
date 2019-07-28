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
    ReelSymbol,
    createGameStore,
    selectFirstRow,
    selectPreviousSymbols,
    selectRoundStartTime,
    spiningDuration,
    stopDelay,
    reelContent
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
                time = map(state)(state => state.time);
            
            const randomSymbol = () => reelContent[Math.floor(Math.random() * reelContent.length)],
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
                        highlightedSymbol: null,
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration)
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel2],
                        previousSymbol: map(previousSymbols)(row => row[1]),
                        currenSymbol: map(firstRow)(row => row[1]),
                        highlightedSymbol: null,
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration + stopDelay)
                    }),
                    reel(scene, {
                        time,
                        mesh: meshes[MeshName.Reel3],
                        previousSymbol: map(previousSymbols)(row => row[2]),
                        currenSymbol: map(firstRow)(row => row[2]),
                        highlightedSymbol: null,
                        spinStartTime: roundStartTime,
                        spinEndTime: map(roundStartTime)(t => t + spiningDuration + stopDelay * 2)
                    }),
                    spinButton(scene, {
                        active: true,
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
