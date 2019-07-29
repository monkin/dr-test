import {
    Mesh,
    Scene,
    StandardMaterial,
    Color3,
    DynamicTexture
} from "babylonjs";
import {
    Component,
    noop,
    asyncContrucor,
    Param,
    changes,
    map,
    numberTransition,
    write,
    composeEffects
} from "rebylon";
import { uid } from "../utils/uid";
import { Combination } from "../../state";

import paytableImage from "./images/paytable.png";
import { loadImage } from "../utils/loadImage";

const locations = {
    [Combination.Cherry1Row]: [0, 184, 819, 196],
    [Combination.BARx3Row]: [819, 184, 594, 196],
    [Combination.SevenRow]: [1413, 184, 635, 196], 
    [Combination.Cherry2Row]: [0, 379, 819, 196], 
    [Combination.BARx2Row]: [819, 379, 594, 196], 
    [Combination.SevenOrCherryRow]: [1413, 379, 635, 196], 
    [Combination.Cherry3Row]: [0, 575, 819, 196], 
    [Combination.BARRow]: [819, 575, 594, 196], 
    [Combination.AnyBARRow]: [1413, 575, 635, 196],
};

export interface PaytableProps {
    mesh: Mesh;
    time: Param<number>;
    winningCombination: Param<Combination | null>;
    highlightWinningCombination: Param<boolean>;
}

const textureWidth = 2048,
    textureHeight = 855;

export const paytable = asyncContrucor(async (scene: Scene, {
    mesh,
    time,
    winningCombination,
    highlightWinningCombination
}: PaytableProps): Promise<Component> => {
    const material = new StandardMaterial(uid("paytableMaterial"), scene),
        image = await loadImage(paytableImage),
        diffuse = new DynamicTexture(uid("paytableDiffuseTexture"), {
            width: textureWidth,
            height: textureHeight,
        }, scene, true),
        diffuseContext = diffuse.getContext(),
        emissive = new DynamicTexture(uid("paytableEmissiveTexture"), {
            width: textureWidth,
            height: textureHeight,
        }, scene, true);
    
    diffuseContext.fillStyle = "#ccc";
    diffuseContext.fillRect(0, 0, textureWidth, textureHeight);
    diffuseContext.drawImage(image, 0, 0);
    diffuse.update();

    const glow = map(highlightWinningCombination)(v => v ? 1 : 0),
        animatedGlow = numberTransition({
            time,
            duration: 500,
            value: glow,
        }),
        updateGlow = write(material, {
            emissiveColor: map(animatedGlow, time)((glow, time) => {
                const v = (Math.sin(time / 200) + 1) * 0.5 * glow;
                return new Color3(v, v, v);
            }),
        });

    const updateEmissive = changes(winningCombination)(combination => {
        const context = emissive.getContext();
        context.fillStyle = "#000";
        context.fillRect(0, 0, textureWidth, textureHeight);
        if (combination) {
            const [l, t, w, h] = locations[combination];
            // draw only highlighted region
            context.drawImage(
                image,
                l, t, w, h,
                l, t, w, h,
            );
        }
        emissive.update();
    });

    material.lightmapTexture = diffuse;
    material.emissiveTexture = emissive;
    material.diffuseColor = new Color3(0, 0, 0);
    material.specularColor = new Color3(0, 0, 0);
    material.sideOrientation = Mesh.FRONTSIDE;
    material.linkEmissiveWithDiffuse = true;

    mesh.material = material;

    return {
        update: composeEffects(
            updateEmissive,
            updateGlow,
        ),
        dispose: () => {
            material.dispose();
            diffuse.dispose();
            emissive.dispose();
        }
    };
});
