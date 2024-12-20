import axios from "axios";
import { TagReference } from "../types/tags";
import { ListFolderResponse, Metadata } from "../types/dropbox";

const apiHost = import.meta.env.VITE_API_HOST;
const tagTemplateId = import.meta.env.VITE_TAG_TEMPLATE_ID as string;

if (!tagTemplateId || !apiHost) throw new Error("Missing envs");

export class ApiClient {
  private apiHost: string;

  constructor() {
    this.apiHost = apiHost;
  }
  public getTemporaryLink = async (rootPath: string, targetClip: string): Promise<string> => {
    const path = targetClip.replace(rootPath.toLowerCase(), "");
    const url = `${this.apiHost}/get_temporary_link`;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      path: `${rootPath}${path}`,
    };

    const {
      data: { link },
    } = await axios.post<{ link: string }>(url, body, { headers });
    return link;
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

  public getFolderEntries = async (
    currentFolderPath: string
  ): Promise<Metadata[]> => {
    try {
      const url = `${apiHost}/list_folder`;
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
        recursive: false,
      };

      let entries: Metadata[] = [];
      let hasMore = true;
      let cursor = null;

      while (hasMore) {
        const { data: listFolderResponse }: { data: ListFolderResponse } =
          await axios.post(url, cursor ? { cursor } : body, {
            headers,
          });

        entries = [...entries, ...listFolderResponse.entries];
        hasMore = listFolderResponse.has_more;
        cursor = listFolderResponse.cursor;
      }

      return entries;
    } catch (e: any) {
      throw new Error(e);
    }
  };

  public getFolderEntriesRecursively = async (
    currentFolderPath: string
  ): Promise<Metadata[]> => {
    try {
      const url = `${apiHost}/list_folder`;
      const urlContinue = `${apiHost}/list_folder/continue`;
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
          filter_some: [tagTemplateId]
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
}
