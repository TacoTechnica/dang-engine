
import { autoserializeAs, inheritSerialization } from "cerialize";
import { DRScene } from "../../../resource/resources/DRScene";
import { ResourceSerializer } from "../../../resource/ResourceSerializer";
import { Game } from "../../Game";
import { GlobalVNCommandRegistry } from "../GlobalVNCommandRegistry";
import { VNCommand } from "../VNCommand";


@inheritSerialization(VNCommand)
export class SceneCommand extends VNCommand {

    @autoserializeAs(new ResourceSerializer(DRScene)) public scene : DRScene;

    constructor() {
        super(GlobalVNCommandRegistry.SCENE, true);
    }

    public *run(game : Game): IterableIterator<any> {

        if (game.getCurrentDRScene() == null || game.getCurrentDRScene().getPath() !== this.scene.getPath()) {
            // TODO: Transition?
            game.loadScene(this.scene);
        }

        return;
    }

}
