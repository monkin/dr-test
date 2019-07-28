import { Scene, Mesh, StandardMaterial, Color3 } from "babylonjs";
import { noop, Component } from "rebylon";
import { uid } from "../utils/uid";

interface BorderProps {
    mesh: Mesh;
}

export function border(scene: Scene, { mesh }: BorderProps): Component {
    const material = new StandardMaterial(uid("borderMaterial"), scene);
    material.diffuseColor = new Color3(0.5, 0.5, 0.5);
    material.emissiveColor = new Color3(0.2, 0.2, 0.3).scale(3);
    material.sideOrientation = Mesh.FRONTSIDE;

    mesh.material = material;

    return {
        update: noop,
        dispose: () => {
            material.dispose();
        }
    };
}