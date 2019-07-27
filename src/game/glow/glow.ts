import {
    Scene,
    GlowLayer
} from "babylonjs";
import {
    Component,
    noop
} from "rebylon";
import { uid } from "../uid";

export function glow(scene: Scene): Component {
    const glowLayer = new GlowLayer(uid("glow"), scene, {
        mainTextureSamples: 4
    });
    return {
        update: noop,
        dispose: () => {
            glowLayer.dispose();
        }
    };
}
