import {
    Scene,
    Mesh,
    StandardMaterial,
    Color3,
    Texture
} from "babylonjs";
import {
    Param,
    group,
    map,
    numberTransition,
    write
} from "rebylon";
import { clickHandler } from "../utils/clickHandler";
import { uid } from "../utils/uid";

import spinImage from "./spin.png";

export interface SpinButtonProps {
    mesh: Mesh;
    time: Param<number>;
    active: Param<boolean>
    onClick: () => void;
}

export function spinButton(scene: Scene, { mesh, time, active, onClick }: SpinButtonProps) {
    const material = new StandardMaterial(uid("spinButtonMaterial"), scene),
        maxGlow = map(active)(active => active ? 1 : 0),
        animatedMaxGlow = numberTransition({
            time,
            duration: 300,
            value: maxGlow,
        }),
        emissiveValue = map(time, animatedMaxGlow)((time, glow) => {
            return ((Math.sin(time / 200) + 1) * 0.1 + 0.25) * glow;
        });
    
    const updateEmission = write(material, {
        emissiveColor: map(emissiveValue)(v => new Color3(0.5, 0.5, 0.33).scale(v)),
    });

    const texture = new Texture(spinImage, scene);

    material.sideOrientation = Mesh.FRONTSIDE;
    material.diffuseColor = new Color3(0.22, 0.22, 0.22);
    material.diffuseTexture = texture;
    material.specularColor = new Color3(0.7, 0.7, 0.7);
    material.alpha = 0.9;
    mesh.material = material;

    return group({
            update: updateEmission,
            dispose: () => {
                material.dispose();
                texture.dispose();
            }
        },
        clickHandler(scene, {
            mesh, onClick,
            enabled: active
        })
    );
}