
import { AbstractTypedSerializer } from "../../resource/typeSerialization/AbstractTypedSerializer";
import { GlobalVNCommandRegistry } from "./GlobalVNCommandRegistry";
import { VNCommand } from "./VNCommand";

export class VNCommandSerializer extends AbstractTypedSerializer<VNCommand> {
    constructor() {
        super(GlobalVNCommandRegistry.instance);
    }
}
