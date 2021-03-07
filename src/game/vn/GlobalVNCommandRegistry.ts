
import { ISerializable } from "cerialize";
import { AbstractTypeRegistry } from "../../resource/typeSerialization/AbstractTypeRegistry";
import { CallCommand } from "./commands/CallCommand";
import { DialogueCommand } from "./commands/DialogueCommand";
import { LabelCommand } from "./commands/LabelCommand";
import { ReturnCommand } from "./commands/ReturnCommand";
import { SceneCommand } from "./commands/SceneCommand";

export class GlobalVNCommandRegistry extends AbstractTypeRegistry {

    public static instance : GlobalVNCommandRegistry = new GlobalVNCommandRegistry();

    public static register(type : Function | ISerializable, name : string) {
        return GlobalVNCommandRegistry.instance.register(type, name);
    }

    public static keyMapped(name : string) {
        return GlobalVNCommandRegistry.instance.keyMapped(name);
    }

    public static getTypeMapping(name : string) {
        return GlobalVNCommandRegistry.instance.getTypeMapping(name);
    }

    // REGISTRY ITEMS
    public static DIALOGUE = GlobalVNCommandRegistry.register(DialogueCommand, "Dialogue");
    public static LABEL = GlobalVNCommandRegistry.register(LabelCommand, "Label");
    public static CALL = GlobalVNCommandRegistry.register(CallCommand, "Call");
    public static RETURN = GlobalVNCommandRegistry.register(ReturnCommand, "Return");
    public static SCENE = GlobalVNCommandRegistry.register(SceneCommand, "Scene");
}
