import {
    Scene,
    HemisphericLight,
    DirectionalLight,
    Color3,
    Vector3,
} from "babylonjs";
import { noop } from "rebylon";
import { uid } from "../utils/uid";

export function lights(scene: Scene) {
    const light1 = new HemisphericLight(uid("light"), new Vector3(0, 1, 0), scene);
	light1.diffuse = new Color3(2, 2, 2);
	light1.specular = new Color3(0.2, 0.2, 0.2);

    const light2 = new DirectionalLight(uid("light"), new Vector3(-0.75, -1, -0.5), scene);
    light2.position = new Vector3(10, 1, 10);
    light2.intensity = 1.5;

    return {
        update: noop,
        dispose() {
            light1.dispose();
            light2.dispose();
        }
    };
}