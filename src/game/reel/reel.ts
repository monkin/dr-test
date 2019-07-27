import {
    Scene,
    Mesh,
    StandardMaterial,
    Texture,
    Color3
} from "babylonjs";
import { Component, noop } from "rebylon";
import { uid } from "../uid";
import { sceneStorage } from "../sceneStorage";
import { lightmapImage } from "./images";

export interface ReelProps {
    mesh: Mesh;
}

const lightmap = sceneStorage("reelTexture", scene => {
    const texture = new Texture(lightmapImage, scene);
    return texture;
});

export function reel(scene: Scene, {
    mesh,
}: ReelProps): Component {
    const material = new StandardMaterial(uid("reelMaterial"), scene);
    material.lightmapTexture = lightmap(scene);
    material.useLightmapAsShadowmap = true;
    material.sideOrientation = Mesh.FRONTSIDE;
    material.diffuseColor = new Color3(0.75, 0.75, 0.75);
    material.specularColor = new Color3(0, 0, 0);

    mesh.material = material;

    return {
        update: noop,
        dispose: () => {

        }
    };
}