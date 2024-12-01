export interface FilePropertiesOverwriteParams {
    path: string,
    property_groups: PropertyGroup[]
}

export interface PropertyGroup {
    fields: Field[]
    template_id: string
}

export interface Field {
    name:string
    value: string
}