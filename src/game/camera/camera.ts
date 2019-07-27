import { Scene, Vector3, ArcRotateCamera } from "babylonjs";
import { Component, noop } from "rebylon";
import { uid } from "../uid";

export function camera(scene: Scene): Component {
    var camera = new ArcRotateCamera(uid("camera"), 0, 0, 5, new Vector3(0, 0, 0), scene);
    ArcRotateCamera.ForceAttachControlToAlwaysPreventDefault = true;
    camera.attachControl(scene.getEngine().getRenderingCanvas()!, false);
    return {
        update: noop,
        dispose() {
            camera.dispose();
        }
    }
}