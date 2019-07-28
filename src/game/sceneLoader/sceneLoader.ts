import { Scene, SceneLoader, Mesh, AbstractMesh } from "babylonjs";
import {
    Component,
    asyncContrucor,
    afterDispose
} from "rebylon";

import sceneFile from "./scene.glb";

export enum MeshName {
    Root = "__root__",
    PayoutsPanel = "Machine_Body_PayoutsMaterial",
    MachineBody = "Machine_Body_BodyMaterial",
    MachineEdge = "Machine_Body_EdgeMaterial",
    SpinButton = "Machine_Body_SpinButtonMaterial",
    RightBanner = "Machine_Body_RightBannerMaterial",
    LeftBanner = "Machine_Body_LeftBannerMaterial",
    Reel1 = "Reel1_Reel1_ReelMaterial",
    Reel2 = "Reel2_Reel2_ReelMaterial",
    Reel3 = "Reel3_Reel3_ReelMaterial"
}

interface LoadedMeshes {
    [MeshName.Root]: AbstractMesh;
    [MeshName.PayoutsPanel]: Mesh;
    [MeshName.MachineBody]: Mesh;
    [MeshName.MachineEdge]: Mesh;
    [MeshName.SpinButton]: Mesh;
    [MeshName.RightBanner]: Mesh;
    [MeshName.LeftBanner]: Mesh;
    [MeshName.Reel1]: Mesh;
    [MeshName.Reel2]: Mesh;
    [MeshName.Reel3]: Mesh;
}

export const sceneLoader = asyncContrucor(async (scene: Scene, onLoad: (meshes: LoadedMeshes) => Component): Promise<Component> => {
    const { meshes } = await SceneLoader.ImportMeshAsync("", "./", sceneFile.replace(/^\//, ""), scene);
    return afterDispose(onLoad(meshes.reduce((r, mesh) => {
        mesh.freezeWorldMatrix();
        r[mesh.id as MeshName] = mesh as (AbstractMesh & Mesh);
        return r;
    }, {} as Partial<LoadedMeshes>) as LoadedMeshes), () => {
        meshes.forEach(mesh => mesh.dispose());
    });
});
