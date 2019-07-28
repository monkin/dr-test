import { Scene, Vector3, ArcRotateCamera } from "babylonjs";
import { Component, noop } from "rebylon";
import { uid } from "../utils/uid";

export function camera(scene: Scene): Component {
    ArcRotateCamera.ForceAttachControlToAlwaysPreventDefault = true;

    var camera = new ArcRotateCamera(uid("camera"), 0, 0, 5, new Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 5;
    camera.attachControl(scene.getEngine().getRenderingCanvas()!, false);
    return {
        update: noop,
        dispose() {
            camera.dispose();
        }
    }
}