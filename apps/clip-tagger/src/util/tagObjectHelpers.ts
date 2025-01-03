import { GenericTags, LabeledTagReference, TagObject, UnlabeledTagReference } from "@editor-hub/tag-system";
import { v4 as uuid } from "uuid";

export const labelTagReference = (
  unlabeledTagReference: UnlabeledTagReference,
): LabeledTagReference => {
  let labeledTagReference: LabeledTagReference = {}
    const keys = Object.keys(unlabeledTagReference)
    keys.forEach((key) => {
      labeledTagReference[key] = unlabeledTagReference[key].map((time) => ({
        time,
        instanceId: uuid(),
        created: performance.now()
      })) 
    })
    return labeledTagReference
};

export const unlabelTagReference = (labeledTagReference: LabeledTagReference): UnlabeledTagReference => {
  const tagReferece: UnlabeledTagReference = {}
  Object.entries(labeledTagReference).forEach(([tagId, timeEntryArray]) => {
    tagReferece[tagId] = timeEntryArray.map(timeEntry => timeEntry.time)
  })

  return tagReferece
}

export const getTagObjectFromId = (tagId: string): TagObject | undefined => {
  let foundTagObject: TagObject | undefined
  Object.values(GenericTags).forEach(tagGroup => tagGroup.tags.forEach(tagObject => {
    if (tagObject.id === tagId) foundTagObject = tagObject
  }))
  return foundTagObject
} 

export const getTagObjectFromInstanceId = (instanceId: string, labeledTagReference: LabeledTagReference): TagObject | undefined => {
  let foundTagId: string | undefined
  Object.entries(labeledTagReference).forEach(([tagId, timeEntryArray]) => {
    timeEntryArray.forEach(timeEntry => {
      if(timeEntry.instanceId === instanceId) foundTagId = tagId
    })
  })
  if(!foundTagId) return;
  const foundTagObject = getTagObjectFromId(foundTagId)
  return foundTagObject
} 