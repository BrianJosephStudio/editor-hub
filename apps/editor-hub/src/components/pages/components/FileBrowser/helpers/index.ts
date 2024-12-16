import { ApiClient } from "../../../../../api/ApiClient";
import { FileTreeNode } from "../../../../../types/app";
import { Metadata } from "../../../../../types/dropbox";
import { TagObject, TagSystem } from "../../../../../types/tags";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

export const fetchRootFolders = async (): Promise<Metadata[]> => {
  const apiClient = new ApiClient();
  const clipMetadataBatch = await apiClient.getFolderEntries(clipsRootPath);
  const reversedClipMetadataBatch = clipMetadataBatch.reverse();

  return reversedClipMetadataBatch
}

export const fetchInitialMetadata = async (fileTree: FileTreeNode, fetchUpfront: number): Promise<Metadata[]> => {
  const apiClient = new ApiClient();
  const fetchedMetadataRaw = await Promise.all(
    fileTree.children!.map((fileTreeNode, index) => {
      if (!fileTreeNode.metadata) throw new Error(`Missing metadata in fileTreeNode for ${fileTreeNode.name}`);
      if (index >= fetchUpfront) return;

      return apiClient.getFolderEntriesRecursively(
        fileTreeNode.metadata.path_lower!
      );
    })
  );
  const fetchedMetadata = fetchedMetadataRaw
    .flat()
    .filter((child) => !!child);

  return fetchedMetadata
}

export const fetchClickedFolderMetadata = async (
  currentFileTree: FileTreeNode,
  fileTreeNode: FileTreeNode,
) => {
  const apiClient = new ApiClient();
  if (!currentFileTree.children || currentFileTree.children.length === 0)
    return;

  const matchingFileTreeNode = currentFileTree.children.find(
    (childTreeNode) => {
      return childTreeNode.path === fileTreeNode.path;
    }
  );
  if (
    !matchingFileTreeNode ||
    (matchingFileTreeNode &&
      matchingFileTreeNode.children &&
      matchingFileTreeNode.children.length > 0)
  )
    return;

  const newMetadata = await apiClient.getFolderEntriesRecursively(
    fileTreeNode.metadata!.path_lower!
  );

  return newMetadata
};

export const resolveTreeStructure = (
  currentFileTreeNode: FileTreeNode,
  newMetadata: Metadata[],
  genericTags: TagSystem
): FileTreeNode => {
  const currentHead = currentFileTreeNode.path;
  const newFileTreeNode = { ...currentFileTreeNode }

  const children: FileTreeNode[] = newMetadata
    .map((metadata) => {
      const currentHeadLength = currentHead.split("/").filter(Boolean).length;

      const metadataPath = getMetadataPath(metadata.path_lower!);
      const metadataLength = metadataPath.split("/").filter(Boolean).length;

      const parentFolder = metadataPath.replace(/\/[^/]*$/, "");

      if (
        (currentHeadLength === 0 && metadataLength === 1) ||
        parentFolder === currentHead
      ) {
        let newFileTreeNode: FileTreeNode = {
          name: metadata.name,
          tag: metadata[".tag"],
          path: getMetadataPath(metadata.path_lower!),
          filtered: false,
          metadata,
        };

        if (newFileTreeNode.tag === "file") {
          if (metadata.property_groups?.length! > 0) {
            try {
              const parsedTagList = JSON.parse(metadata.property_groups![0].fields[0].value)
              const tagIdList = Object.keys(parsedTagList)
              const tagList: TagObject[] = tagIdList.map((tagId => {
                const matchingTag = Object.values(genericTags)
                .flatMap(tagGroup => tagGroup.tags)
                  .find(tagObject => tagObject.id === tagId)

                if (!matchingTag) throw new Error();
                return matchingTag
              }))

              newFileTreeNode.tagList = tagList
            } catch (e) {
              console.log(newFileTreeNode.name) //TODO: remove for production
              console.log(newFileTreeNode.metadata!.property_groups![0].fields[0].value) //TODO: remove for production
              console.error(e) //TODO: remove for production
            }
          }
        }

        if (newFileTreeNode.tag === "folder") {
          newFileTreeNode = resolveTreeStructure(
            newFileTreeNode,
            newMetadata,
            genericTags
          );
        }

        return newFileTreeNode;
      }

      return null;
    })
    .filter((child) => !!child);

  if (
    !newFileTreeNode.children ||
    newFileTreeNode.children.length === 0
  ) {
    newFileTreeNode.children = children
  } else {
    children.forEach((child) => {
      const matchingFileTreeNodeIndex =
        newFileTreeNode.children!.findIndex(
          (childFileTreeNode) => childFileTreeNode.path === child.path
        );
      if (matchingFileTreeNodeIndex === -1) return;
      const newChildren = [...newFileTreeNode.children!]
      newChildren[matchingFileTreeNodeIndex] = child
      newFileTreeNode.children = newChildren
    });
  }

  return newFileTreeNode;
};

const getMetadataPath = (path: string) => {
  return path.replace(clipsRootPath.toLowerCase(), "");
};