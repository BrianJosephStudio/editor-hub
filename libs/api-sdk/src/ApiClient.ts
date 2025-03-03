import axios from "axios";
import type { ListFolderResponse, Metadata, SharedLinkResponse } from "@editor-hub/dropbox-types";
import { UnlabeledTagReference, TimeCode } from "@editor-hub/tag-system";
import { checkClipUploadJob, uploadClips } from "./utils/uploadClip";
import { ClipUpload } from "./ClipUploads";
import { FileMetadata, PropertyGroup } from "@editor-hub/dropbox-types/src/types/dropbox";

export class ApiClient {
  private apiHost: string;
  public tagTemplateId: string;
  public trackLicenseTemplateId: string;

  constructor(
    apiHost: string,
    tagTemplateId: string,
    trackLicenseTemplateId: string
  ) {
    this.apiHost = apiHost;
    this.tagTemplateId = tagTemplateId;
    this.trackLicenseTemplateId = trackLicenseTemplateId;
  }
  public getTemporaryLink = async (targetClip: string): Promise<string> => {
    const url = `${this.apiHost}/get_temporary_link`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path: targetClip
    };

    const {
      data: { link },
    } = await axios.post<{ link: string }>(url, body, { headers });
    return link;
  };

  private addFilePropertyGroup = async (path: string, templateId: string) => {
    const url = `${this.apiHost}/properties/add`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path,
      property_groups: [
        {
          template_id: templateId,
          fields: [
            {
              name: templateId === this.tagTemplateId ? "tagReference" : "trackLicense",
              value: "",
            },
          ],
        },
      ],
    };

    await axios.post(url, body, { headers });
  };

  public removeFilePropertyGroup = async (path: string, templateId: string) => {
    const url = `${this.apiHost}/properties/remove`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path,
      property_template_ids: [templateId]
    };

    await axios.post(url, body, { headers });
  };

  public updateFileProperties = async (
    path: string,
    value: string,
    templateId: string
  ): Promise<boolean> => {

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
              name: templateId === this.tagTemplateId ? "tagReference" : "trackLicense",
              value,
            },
          ],
          template_id: templateId,
        },
      ],
    };
    console.log('apiClient 2', value)

    try {
      console.log("post request!")
      await axios.post(url, body, { headers });
      return true
    } catch (error: any) {
      return false
    }
  };

  public getMetadata = async (path: string, templateId: string): Promise<PropertyGroup | null> => {
    const url = `${this.apiHost}/get_metadata`;
    const headers = { "Content-Type": "application/json" };
  
    const body = {
      path,
      include_property_groups: {
        ".tag": "filter_some",
        filter_some: [templateId],
      },
    };
  
    const {
      data: { property_groups },
    } = await axios.post<FileMetadata>(url, body, { headers });

    if(!property_groups) return null
  
    return property_groups.find((propertyGroup: any) => propertyGroup.template_id === templateId) || null;
  };
  
  public getLabeledTagReferenceFromMetadata = async (path: string): Promise<UnlabeledTagReference> => {
    const tagPropertyGroup = await this.getMetadata(path, this.tagTemplateId);
  
    if (!tagPropertyGroup) {
      await this.addFilePropertyGroup(path, this.tagTemplateId);
      return {};
    }
  
    const fieldName = "tagReference"
    const tagPropertyGroupField = tagPropertyGroup.fields.find((field: any) => field.name === fieldName);
  
    if (!tagPropertyGroupField?.value) {
      return {};
    }
  
    return JSON.parse(tagPropertyGroupField.value);
  };

  public getTrackLicenseFromMetadata = async (path: string): Promise<string | null> => {
    const tagPropertyGroup = await this.getMetadata(path, this.trackLicenseTemplateId);
  
    if (!tagPropertyGroup) {
      await this.addFilePropertyGroup(path, this.trackLicenseTemplateId);
      return null;
    }
  
    const fieldName = "trackLicense";
    const tagPropertyGroupField = tagPropertyGroup.fields.find((field: any) => field.name === fieldName);
  
    if (!tagPropertyGroupField?.value) {
      return null;
    }
  
    return tagPropertyGroupField.value;
  };

  public setTrueNames = (
    entries: { from_path: string; to_path: string }[]
  ): Promise<boolean> => {
    return new Promise(async (resolve, _reject) => {
      try {
        if (entries.length === 0) return resolve(false);
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
        resolve(false);
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
  public getFolderEntries = async (
    currentFolderPath: string
  ): Promise<Metadata[]> => {
    try {
      const url = `${this.apiHost}/list_folder`;
      const headers = {
        "Content-Type": "application/json",
      };

      const body = {
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_media_info: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        path: currentFolderPath,
        include_property_groups: {
          ".tag": "filter_some",
          filter_some: [this.tagTemplateId]
        },
        recursive: false,
      };

      let entries: any[] = [];
      let hasMore = true;
      let cursor = null;

      while (hasMore) {
        //@ts-ignore
        const { data } = await axios.post(url, cursor ? { cursor } : body, {
          headers,
        });

        entries = [...entries, ...data.entries];
        hasMore = data.has_more;
        cursor = data.cursor;
      }

      return entries;
    } catch (e: any) {
      throw new Error(e);
    }
  };

  public removeTag = async (
    path: string,
    tagObjectId: string,
    newTagEntry: TimeCode[]
  ): Promise<UnlabeledTagReference> => {
    const upToDateTagReference = await this.getLabeledTagReferenceFromMetadata(path);
    let updatedTagReference: UnlabeledTagReference = upToDateTagReference;
    if (newTagEntry.length === 0) {
      delete updatedTagReference[tagObjectId];
    } else {
      updatedTagReference = {
        ...upToDateTagReference,
        [tagObjectId]: newTagEntry,
      };
    }

    console.log("tagReferenceMaster:", upToDateTagReference);
    console.log("updatedTagReference:", updatedTagReference);

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
          template_id: this.tagTemplateId,
        },
      ],
    };

    await axios.post(url, body, { headers });
    return await this.getLabeledTagReferenceFromMetadata(path);
  };

  createSharedLinkWithSettings = async (path: string): Promise<SharedLinkResponse> => {
    try {
      const url = `${this.apiHost}/create_shared_link_with_settings`;
      const headers = {
        "Content-Type": "application/json",
      };

      const body = {
        path
      };

      const { data } = await axios.post<SharedLinkResponse>(url, body, { headers });

      return data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public getFolderEntriesRecursively = async (
    currentFolderPath: string
  ): Promise<Metadata[]> => {
    try {
      const url = `${this.apiHost}/list_folder`;
      const urlContinue = `${this.apiHost}/list_folder/continue`;
      const headers = {
        "Content-Type": "application/json",
      };

      const body = {
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_media_info: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        include_property_groups: {
          ".tag": "filter_some",
          filter_some: [this.tagTemplateId]
        },
        path: currentFolderPath,
        recursive: true,
      };

      let entries: Metadata[] = [];
      let hasMore = false;
      let cursor = null;

      do {
        const { data: listFolderResponse }: { data: ListFolderResponse } =
          await axios.post(
            cursor ? urlContinue : url,
            cursor ? { cursor } : body,
            {
              headers,
            }
          );

        entries = [...entries, ...listFolderResponse.entries];
        hasMore = listFolderResponse.has_more;
        cursor = listFolderResponse.cursor;
      } while (hasMore);

      return entries;
    } catch (e: any) {
      throw new Error(e);
    }
  };

  public download = async (path: string) => {
    const url = `${this.apiHost}/download`;
    const headers = {
      'Dropbox-API-Arg': JSON.stringify({ path })
    };

    const {
      data
    } = await axios.post(url, undefined, { headers, responseType: 'arraybuffer' });
    return data
  }

  public uploadClips = (clipUploads: ClipUpload[]) => uploadClips(this.apiHost, clipUploads)

  public checkClipUploadJob = (jobId: string) => checkClipUploadJob(this.apiHost, jobId)

  public delete = async (path: string) => {
    const url = `${this.apiHost}/delete_v2`
    const body = { path }

    const { data } = await axios.post(url, body)

    return data
  }
}
