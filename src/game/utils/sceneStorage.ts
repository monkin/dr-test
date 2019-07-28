import { Scene } from "babylonjs/scene";

export function sceneStorage<T>(key: string, create: (scene: Scene) => T) {
    return (scene: Scene): T => {
        const metadata = scene.metadata || (scene.metadata = {});
        return metadata[key] || (metadata[key] = create(scene));
    };
}
