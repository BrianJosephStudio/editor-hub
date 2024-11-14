import { LabeledTagReference, TagReference } from "../types/tags";
import { v4 as uuid } from "uuid";

export const labelTagReference = (unlabeledTagReference: TagReference): LabeledTagReference => {
    let labeledTagReference: LabeledTagReference = {}
    const keys = Object.keys(unlabeledTagReference)
    keys.forEach((key) => {
      labeledTagReference[key] = unlabeledTagReference[key].map((time) => ({
        time,
        instanceId: uuid()
      })) 
    })
    return labeledTagReference
}
