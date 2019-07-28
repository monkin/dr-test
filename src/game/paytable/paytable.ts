import {
    Mesh,
    Scene,
    StandardMaterial,
    Texture,
    Color3
} from "babylonjs";
import { Component, noop } from "rebylon";
import { uid } from "../utils/uid";

import paytableImage from "./images/paytable.png";

export interface PaytableProps {
    mesh: Mesh;
}

export function paytable(scene: Scene, { mesh }: PaytableProps): Component {
    const material = new StandardMaterial(uid("paytableMaterial"), scene),
        texture = new Texture(paytableImage, scene, false);
    
    material.diffuseTexture = texture;
    material.specularColor = new Color3(0.1, 0.1, 0.1);
    material.sideOrientation = Mesh.FRONTSIDE;

    mesh.material = material;

    return {
        update: noop,
        dispose: () => {
            material.dispose();
            texture.dispose();
        }
    };
}
