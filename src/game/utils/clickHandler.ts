import {
    Scene,
    Mesh,
    ActionManager,
    ExecuteCodeAction
} from "babylonjs";
import {
    Param,
    Component,
    stream
} from "rebylon";

export interface ClickHandlerProps {
    mesh: Mesh
    enabled?: Param<boolean>;
    onClick: () => void;
}

export function clickHandler(scene: Scene, { mesh, enabled = true, onClick }: ClickHandlerProps): Component {
    return stream(enabled)(enabled => {
        if (enabled) {
            const actionManager = mesh.actionManager || (mesh.actionManager = new ActionManager(scene)),
                action = new ExecuteCodeAction(ActionManager.OnPickTrigger, () => onClick());
            actionManager.registerAction(action);
            return () => {
                actionManager.unregisterAction(action);
            };
        }
    });
}
