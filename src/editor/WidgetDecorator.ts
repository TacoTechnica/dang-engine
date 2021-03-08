
import "reflect-metadata"
import { INewable, ISerializable } from "cerialize";


function Widget<T>(target: Object, propertyKey: string | symbol, widgetType : Function | INewable<T> | ISerializable) {
    Reflect.defineMetadata("custom:annotations:Widget", widgetType, target, propertyKey);
}
