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
    write
} from "rebylon";
import { uid } from "../utils/uid";
import { sceneStorage } from "../utils/sceneStorage";
import {
    lightmapImage,
    symbolImageMap,
    symbolImageSize
} from "./images";
import { ReelSymbol, reelContent } from "../../state";
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
}

const reelTextures = asyncContrucor(async (scene: Scene, { offset, material }: ReelTextureProps): Promise<Component> => {
    const images = await Promise.all(reelContent.map(loadReelSymbol));
    const { width, height } = symbolImageSize,
        spacing = 16,
        diffuse = new DynamicTexture(uid("reelTexture"), {
            width,
            height: (height + spacing) * 5,
        }, scene, true),
        context = diffuse.getContext();
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, (height + spacing) * 5);
    images.forEach((image, i) => {
        context.drawImage(image, 0, (height + spacing) * i);
    });

    diffuse.vScale = 2.5 / 5;
    diffuse.wrapV = 1;
    diffuse.update();

    material.diffuseTexture = diffuse;

    const updateOffset = write(diffuse, {
        vOffset: map(offset)(offset => (offset - 3.7) / 5)
    });

    return {
        update: composeEffects(updateOffset),
        dispose: () => {
            diffuse.dispose();
        }
    };
});



export interface ReelProps {
    mesh: Mesh;
    topSymbol: Param<ReelSymbol>;
}

const loadLightmap = sceneStorage("reelLightmap", scene => {
    const texture = new Texture(lightmapImage, scene);
    return texture;
});

export function reel(scene: Scene, {
    mesh,
    topSymbol
}: ReelProps): Component {
    const material = new StandardMaterial(uid("reelMaterial"), scene);
    material.lightmapTexture = loadLightmap(scene);
    material.useLightmapAsShadowmap = true;
    material.sideOrientation = Mesh.FRONTSIDE;
    material.diffuseColor = new Color3(0.75, 0.75, 0.75);
    material.specularColor = new Color3(0, 0, 0);

    mesh.material = material;

    return afterDispose(
        reelTextures(scene, {
            material,
            offset: map(topSymbol)(symbol => {
                return reelContent.indexOf(symbol);
            })
        }),
        () => material.dispose()
    );
}