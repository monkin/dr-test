import {
    Scene,
    Mesh,
    StandardMaterial,
    Color3,
} from "babylonjs";
import { noop } from "rebylon";
import { uid } from "../utils/uid";

interface BodyProps {
    mesh: Mesh;
}

export function body(scene: Scene, { mesh }: BodyProps) {
    const material = new StandardMaterial(uid("bodyMaterial"), scene);
    material.diffuseColor = new Color3(0.15, 0.15, 0.15);
    material.specularColor = new Color3(0.1, 0.1, 0.1);
    material.sideOrientation = Mesh.FRONTSIDE;

    mesh.material = material;

    return {
        update: noop,
        dispose: () => {
            material.dispose();
        }
    };
}
