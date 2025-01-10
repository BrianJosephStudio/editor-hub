import { PropertyGroup } from "./PropertyGroup"
import { PropertyBaseProps, PropertyType } from "./types"

export class PropertyBase {
  public readonly active: boolean
  public readonly canSetEnabled: boolean
  public readonly enabled: boolean
  public readonly isEffect: boolean
  public readonly isMask: boolean
  public readonly isModified: boolean
  public readonly matchName: string
  public readonly name: string
  public readonly parentProperty: PropertyGroup | null
  public readonly propertyDepth: number
  public readonly propertyIndex: number
  public readonly propertyType: PropertyType
  public readonly selected: boolean

  constructor(propertyBaseProps: PropertyBaseProps){
      this.active = propertyBaseProps.active
      this.canSetEnabled = propertyBaseProps.canSetEnabled
      this.enabled = propertyBaseProps.enabled
      this.isEffect = propertyBaseProps.isEffect
      this.isMask = propertyBaseProps.isMask
      this.isModified = propertyBaseProps.isModified
      this.matchName = propertyBaseProps.matchName
      this.name = propertyBaseProps.name
      this.parentProperty = propertyBaseProps.parentProperty 
      this.propertyDepth = propertyBaseProps.propertyDepth
      this.propertyIndex = propertyBaseProps.propertyIndex
      this.propertyType = propertyBaseProps.propertyType
      this.selected = propertyBaseProps.selected
  }
}