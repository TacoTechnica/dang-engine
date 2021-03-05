import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { DefaultResources } from './DefaultResources';
import { Resource } from './Resource';
import { DRScene } from './resources/DRScene';
import { ResourceSerializer } from './ResourceSerializer';
import { StorageManager } from "./StorageManager";


@inheritSerialization(Resource)
export class ProjectInfo extends Resource {

    @autoserialize public name : string = "Example Project";
    @autoserialize public author : string = "You!";
    @autoserializeAs(new ResourceSerializer(DRScene)) public startingScene : DRScene;
    @autoserializeAs(DefaultResources) public defaultResources : DefaultResources;

    public getStartScene() : DRScene {return this.startingScene;}

}
