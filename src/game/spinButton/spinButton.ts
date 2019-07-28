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

import spinImage from "./images/spin.png";

export interface SpinButtonProps {
    mesh: Mesh;
    time: Param<number>;
    active: Param<boolean>
    onClick: () => void;
}

export function spinButton(scene: Scene, { mesh, time, active, onClick }: SpinButtonProps) {
    const material = new StandardMaterial(uid("spinButtonMaterial"), scene),
        activeValue = map(active)(active => active ? 1 : 0),
        animatedActiveValue = numberTransition({
            time,
            duration: 500,
            value: activeValue,
        }),
        opacity = map(animatedActiveValue)(v => v * 0.5 + 0.5),
        emissiveValue = map(time, animatedActiveValue)((time, glow) => {
            return ((Math.sin(time / 200) + 1) * 0.5) * glow;
        });
    
    const updateMaterial = write(material, {
        emissiveColor: map(emissiveValue)(v => new Color3(0.4, 0.4, 0.4).scale(v)),
        alpha: opacity,
    });

    const texture = new Texture(spinImage, scene);

    material.sideOrientation = Mesh.FRONTSIDE;
    material.diffuseColor = new Color3(0.75, 0.75, 0.75);
    material.diffuseTexture = texture;
    material.emissiveTexture = texture;
    material.specularColor = new Color3(0.2, 0.2, 0.2);
    material.specularPower = 20;
    material.alpha = 0.9;
    mesh.material = material;

    return group({
            update: updateMaterial,
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