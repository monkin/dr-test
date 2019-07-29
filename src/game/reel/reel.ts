import {
    Scene,
    Mesh,
    StandardMaterial,
    Texture,
    Color3,
    DynamicTexture
} from "babylonjs";
import { memoize } from "lodash-es";
import {
    Component,
    Param,
    composeEffects,
    asyncContrucor,
    afterDispose,
    map,
    write,
    changes,
    numberTransition
} from "rebylon";
import { uid } from "../utils/uid";
import { sceneStorage } from "../utils/sceneStorage";
import {
    lightmapImage,
    symbolImageMap,
    symbolImageSize
} from "./images";
import { ReelSymbol, allSybols } from "../../state";
import { loadImage } from "../utils/loadImage";

const loadReelSymbol = memoize((symbol: ReelSymbol) => {
    return loadImage(symbolImageMap[symbol]);
});

interface ReelTextureProps {
    /**
     * Offset in symbols
     */
    offset: Param<number>;
    material: StandardMaterial;
    winningSymbol: Param<ReelSymbol | null>;
    highlightWinningSymbol: Param<boolean>;
    time: Param<number>;
}

const reelTextures = asyncContrucor(async (scene: Scene, { offset, material, winningSymbol, highlightWinningSymbol, time }: ReelTextureProps): Promise<Component> => {
    const images = await Promise.all(allSybols.map(loadReelSymbol)),
        { width, height } = symbolImageSize,
        spacing = 16,
        emissive = new DynamicTexture(uid("reelEmissiveTexture"), {
            width,
            height: (height + spacing) * allSybols.length,
        }, scene, true),
        diffuse = new DynamicTexture(uid("reelDiffuseTexture"), {
            width,
            height: (height + spacing) * allSybols.length,
        }, scene, true),
        diffuseContext = diffuse.getContext();
    diffuseContext.fillStyle = "#FEFEFE";
    diffuseContext.fillRect(0, 0, width, (height + spacing) * allSybols.length);
    images.forEach((image, i) => {
        diffuseContext.drawImage(image, 0, (height + spacing) * i);
    });

    diffuse.update();

    emissive.vScale = diffuse.vScale = 2.5 / allSybols.length;
    emissive.wrapV = diffuse.wrapV = 1;

    material.diffuseTexture = diffuse;

    const updateEmissive = changes(winningSymbol)(symbol => {
        const context = emissive.getContext();
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, (height + spacing) * allSybols.length);
        if (symbol) {
            const i = allSybols.indexOf(symbol);
            context.drawImage(images[i], 0, i * (height + spacing));
        }
        emissive.update();
    });

    material.emissiveTexture = emissive;

    const textureOffset = map(offset)(offset => -offset / allSybols.length + 0.45),
        updateOffset = composeEffects(
            write(diffuse, { vOffset: textureOffset }),
            write(emissive, { vOffset: textureOffset }),
        );
    
    const maxGlow = map(highlightWinningSymbol)(v => v ? 1 : 0),
        animatedMaxGlow = numberTransition({ time, value: maxGlow, duration: 500 }),
        updateGlow = write(material, {
            emissiveColor: map(time, animatedMaxGlow)((time, glow) => {
                const v = glow * (Math.sin(time / 200) + 1) * 0.5;
                return new Color3(v, v, v);
            })
        });

    return {
        update: composeEffects(updateOffset, updateEmissive, updateGlow),
        dispose: () => {
            diffuse.dispose();
            emissive.dispose();
        }
    };
});

export interface ReelProps {
    mesh: Mesh;
    previousSymbol: Param<ReelSymbol>;
    currenSymbol: Param<ReelSymbol>;
    spinStartTime: Param<number>;
    spinEndTime: Param<number>;
    winningSymbol: Param<ReelSymbol | null>;
    highlightWinningSymbol: Param<boolean>;
    time: Param<number>;
}

const loadLightmap = sceneStorage("reelLightmap", scene => {
    const texture = new Texture(lightmapImage, scene);
    return texture;
});

const rotationsPerRound = 10;

export function reel(scene: Scene, {
    mesh,
    previousSymbol,
    currenSymbol,
    spinStartTime,
    spinEndTime,
    winningSymbol,
    highlightWinningSymbol,
    time
}: ReelProps): Component {
    const material = new StandardMaterial(uid("reelMaterial"), scene);
    material.lightmapTexture = loadLightmap(scene);
    material.useLightmapAsShadowmap = true;
    material.sideOrientation = Mesh.FRONTSIDE;
    material.diffuseColor = new Color3(0.75, 0.75, 0.75);
    material.specularColor = new Color3(0.1, 0.1, 0.1);

    mesh.material = material;

    const offset = map(
        previousSymbol,
        currenSymbol,
        spinStartTime,
        spinEndTime,
        time
    )((
        previous,
        current,
        startTime,
        endTime,
        time
    ) => {
        const offset1 = allSybols.indexOf(previous),
            offset2 = allSybols.indexOf(current) - rotationsPerRound * allSybols.length;
        if (time <= startTime) {
            return offset1;
        } else if (time >= endTime) {
            return offset2;
        } else {
            return offset1 + (offset2 - offset1) * (time - startTime) / (endTime - startTime);
        }
    });

    return afterDispose(
        reelTextures(scene, {
            material,
            offset,
            time,
            highlightWinningSymbol,
            winningSymbol,
        }),
        () => material.dispose()
    );
}