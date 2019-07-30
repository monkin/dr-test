import { Scene, Vector3, ArcRotateCamera } from "babylonjs";
import { Component, noop } from "rebylon";
import { uid } from "../utils/uid";

export function camera(scene: Scene): Component {
    ArcRotateCamera.ForceAttachControlToAlwaysPreventDefault = true;

    const alpha = Math.PI,
        beta = Math.PI / 3,
        delta = Math.PI / 8,
        camera = new ArcRotateCamera(uid("camera"), alpha, beta, 4, new Vector3(0, 0, 0), scene);

    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 5;
    camera.lowerAlphaLimit = alpha - delta;
    camera.upperAlphaLimit = alpha + delta;
    camera.lowerBetaLimit = beta - delta;
    camera.upperBetaLimit = beta + delta;
    camera.panningSensibility = 0;
    camera.attachControl(scene.getEngine().getRenderingCanvas()!, false);
    return {
        update: noop,
        dispose() {
            camera.dispose();
        }
    }
}