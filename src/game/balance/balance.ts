import { Scene, Mesh, StandardMaterial, DynamicTexture, Color3 } from "babylonjs";
import { Param, composeEffects, changes, numberTransition, map, group } from "rebylon";
import { uid } from "../utils/uid";
import { clickHandler } from "../utils/clickHandler";

export interface BalanceProps {
    mesh: Mesh;
    balance: Param<number>;
    time: Param<number>;
    clickable: Param<boolean>;
    onClick: () => void;
}

const textureWidth = 256,
    textureHeight = 75;

export function balance(scene: Scene, { mesh, balance, time, clickable, onClick }: BalanceProps) {
    const material = new StandardMaterial(uid("balanceMatreial"), scene),
        texture = new DynamicTexture(
            uid("balanceTexture"),
            { width: textureWidth, height: textureHeight },
            scene,
            true,
        ),
        animatedBalance = numberTransition({
            time,
            duration: 1000,
            value: balance,
        }),
        balanceString = map(animatedBalance)(v => v.toFixed());
    
    const updateTexture = changes(balanceString)(balance => {
        const context = texture.getContext();

        context.fillStyle = "#ccc";
        context.fillRect(0, 0, textureWidth, textureHeight);

        context.font = "bold 50px sans-serif";
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillStyle = "#ff2222";
        context.strokeStyle = "#000";
        context.lineWidth = 2;
        context.fillText("$", 15, textureHeight * 0.5);
        context.strokeText("$", 15, textureHeight * 0.5)

        context.textAlign = "right";
        context.fillText(balance, textureWidth - 15, textureHeight * 0.5);
        context.strokeText(balance, textureWidth - 15, textureHeight * 0.5);

        texture.update();
    });
    
    material.diffuseTexture = texture;
    material.specularColor = new Color3(0.5, 0.5, 0.5);
    material.emissiveColor = new Color3(0.05, 0.05, 0.05);
    material.specularPower = 20;
    material.sideOrientation = Mesh.FRONTSIDE;

    mesh.material = material;
    return group({
            update: updateTexture,
            dispose: () => {
                material.dispose();
                texture.dispose();
            }
        },
        clickHandler(scene, {
            mesh, onClick,
            enabled: clickable
        }),
    );
}