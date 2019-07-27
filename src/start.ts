import "babel-core/register";
import "babel-polyfill";
import "pepjs";
import "babylonjs-loaders";

import { Engine, Scene } from "babylonjs";
import { group } from "rebylon";
import {
    camera,
    sceneLoader,
    lights,
    reel,
    MeshName,
    border,
    glow,
    body,
    paytable
} from "./game";

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement,
        engine = new Engine(canvas, true, {
            antialias: true,
            preserveDrawingBuffer: true
        }),
        scene = new Scene(engine),
        app = group(
            camera(scene),
            lights(scene),
            glow(scene),
            sceneLoader(scene, meshes => group(
                paytable(scene, {
                    mesh: meshes[MeshName.PayoutsPanel],
                }),
                reel(scene, {
                    mesh: meshes[MeshName.Reel1],
                }),
                reel(scene, {
                    mesh: meshes[MeshName.Reel2],
                }),
                reel(scene, {
                    mesh: meshes[MeshName.Reel3],
                }),
                border(scene, {
                    mesh: meshes[MeshName.MachineEdge],
                }),
                body(scene, {
                    mesh: meshes[MeshName.MachineBody],
                })
            )),
        );
    
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
