import { PropertyBase } from "./PropertyBase";
import { PropertyGroupProps } from "./types";

export class PropertyGroup extends PropertyBase {
    public readonly numProperties: number
    constructor(propertyGroupProps: PropertyGroupProps) {
        super(propertyGroupProps)
        this.numProperties = propertyGroupProps.numProperties
    }
}