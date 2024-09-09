import axios from "axios";
import { TagReference } from "../types/tags";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;
const tagTemplateId = import.meta.env.VITE_TAG_TEMPLATE_ID as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export class ApiClient {
  private apiHost: string;
  private clipsRootPath: string;

  constructor() {
    this.apiHost = apiHost;
    this.clipsRootPath = clipsRootPath;
  }
  public getTemporaryLink = async (targetClip: string): Promise<string> => {
    const path = targetClip.replace(this.clipsRootPath.toLowerCase(), "");
    const url = `${this.apiHost}/get_temporary_link`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path: `${this.clipsRootPath}${path}`,
    };

    const {
      data: { link },
    } = await axios.post<{ link: string }>(url, body, { headers });
    return link;
  };

  private addFilePropertyGroup = async (path: string) => {
    const url = `${this.apiHost}/properties/add`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path,
      property_groups: [
        {
          template_id: tagTemplateId,
          fields: [
            {
              name: "tagReference",
              value: "",
            },
          ],
        },
      ],
    };

    await axios.post(url, body, { headers });
  };

  public updateFileProperties = async (
    path: string,
    tagReferenceToAdd: TagReference,
    exclusiveTagIds: string[] | undefined,
    unique?: boolean
  ): Promise<TagReference> => {
    const upToDateTagReference = await this.getMetadata(path);
    let updatedTagReference: TagReference = upToDateTagReference;

    if (exclusiveTagIds) {
      exclusiveTagIds.forEach((tagId) => {
        if (upToDateTagReference[tagId]) {
          delete updatedTagReference[tagId];
        }
      });
    }

    Object.keys(tagReferenceToAdd).map((newTagId) => {
      const referenceExistsInMaster = Array.isArray(
        upToDateTagReference[newTagId]
      );
  
      if (!unique && referenceExistsInMaster) {
        updatedTagReference[newTagId] = updatedTagReference[
          newTagId
        ].concat(tagReferenceToAdd[newTagId]);
      } else {
        updatedTagReference = {
          ...upToDateTagReference,
          ...tagReferenceToAdd,
        };
      }
    })

    const url = `${this.apiHost}/properties/update`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path,
      update_property_groups: [
        {
          add_or_update_fields: [
            {
              name: "tagReference",
              value: JSON.stringify(updatedTagReference),
            },
          ],
          template_id: tagTemplateId,
        },
      ],
    };

    await axios.post(url, body, { headers });
    return await this.getMetadata(path);
  };

  public getMetadata = async (path: string): Promise<TagReference> => {
    const url = `${this.apiHost}/get_metadata`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path,
      include_property_groups: {
        ".tag": "filter_some",
        filter_some: [tagTemplateId],
      },
    };

    const {
      data: { property_groups },
    } = await axios.post(url, body, { headers });

    const tagPropertyGroup = property_groups.find((propertyGroup: any) => {
      return (propertyGroup.template_id = tagTemplateId);
    });

    if (!tagPropertyGroup) {
      await this.addFilePropertyGroup(path);
      return {};
    }

    if (!tagPropertyGroup) {
      return {};
    }

    const tagPropertyGroupField = tagPropertyGroup.fields.find(
      (field: any) => field.name === "tagReference"
    );

    if (!tagPropertyGroupField.value) {
      return {};
    }

    return JSON.parse(tagPropertyGroupField.value);
  };

  public setTrueNames = (
    entries: { from_path: string; to_path: string }[]
  ): Promise<boolean> => {
    return new Promise(async (resolve, _reject) => {
      try {
        const url = `${this.apiHost}/move_batch_v2`;
        const headers = {
          "Content-Type": "application/json",
        };

        const body = {
          allow_ownership_transfer: false,
          autorename: false,
          entries,
        };

        const {
          data: { async_job_id },
        } = await axios.post(url, body, { headers });

        let iterator = 0;
        const limit = 100;
        const intervalId = setInterval(async () => {
          const jobComplete = await this.moveCheck(async_job_id);
          if (jobComplete) {
            clearInterval(intervalId);
            resolve(true);
          }
          if (iterator > limit) {
            resolve(false);
          }
          iterator++;
        }, 500);
      } catch (e) {
        console.error(e);
        resolve(false)
      }
    });
  };

  public moveCheck = async (async_job_id: string) => {
    const url = `${this.apiHost}/move_batch/check_v2`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      async_job_id,
    };
    const { data } = await axios.post(url, body, { headers });

    if (data[".tag"] === "complete") {
      return true;
    }
    return false;
  };
}
