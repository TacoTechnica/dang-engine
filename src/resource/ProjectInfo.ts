import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { Resource } from './Resource';
import { DRScene } from './resources/DRScene';
import { ResourceSerializer } from './ResourceSerializer';
import { StorageManager } from "./StorageManager";


@inheritSerialization(Resource)
export class ProjectInfo extends Resource {

    @autoserialize public name : string = "Example Project";
    @autoserialize public author : string = "You!";
    @autoserializeAs(new ResourceSerializer(DRScene)) public startingScene : DRScene;

    public getStartScene() : DRScene {return this.startingScene;}

}
