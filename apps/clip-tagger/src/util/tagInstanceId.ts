import { LabeledTagReference, TagReference } from "../types/tags";
import { v4 as uuid } from "uuid";

export const labelTagReference = (
  unlabeledTagReference: TagReference,
  currentLabeledTagReference: LabeledTagReference
): LabeledTagReference => {
  let labeledTagReference: LabeledTagReference = {};
  const keys = Object.keys(unlabeledTagReference);

  keys.forEach((key) => {
    labeledTagReference[key] = unlabeledTagReference[key].map((time) => {
      const existingEntry = currentLabeledTagReference[key]?.find(
        (entry) => entry.time === time
      );

      if (existingEntry) {
        return {
          time: existingEntry.time,
          instanceId: existingEntry.instanceId,
          created: existingEntry.created,
        };
      }

      return {
        time,
        instanceId: uuid(),
        created: Date.now(),
      };
    });
  });

  return labeledTagReference;
};
