import { Metadata } from "@editor-hub/dropbox-types";
import apiClient from "../api/ApiClient";
import { FileTreeName, FileTreeNode } from "../types/app";
import { TagObject, TagSystem } from "@editor-hub/tag-system";

export const fetchRootFolders = async (rootPath: string): Promise<Metadata[]> => {
  const clipMetadataBatch = await apiClient.getFolderEntries(rootPath);
  const reversedClipMetadataBatch = clipMetadataBatch.reverse();

  return reversedClipMetadataBatch
}

export const fetchInitialMetadata = async (fileTree: FileTreeNode, fetchUpFront?: number): Promise<Metadata[]> => {
  const fetchedMetadataRaw = await Promise.all(
    fileTree.children!.map((fileTreeNode, index) => {
      if (!fileTreeNode.metadata) throw new Error(`Missing metadata in fileTreeNode for ${fileTreeNode.name}`);
      if (fetchUpFront && index >= fetchUpFront) return;

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

export const createFileTreeNodeFromPath = async (path: string, rootPath: string, fileTreeName?: FileTreeName, filtered: boolean = false, ) => {
  const metadata = await apiClient.getMetadata(path)
  const newFileTreeNode: FileTreeNode = {
    name: metadata.name,
    fileTreeName: fileTreeName,
    tag: metadata[".tag"],
    path:  getMetadataPath(rootPath, metadata.path_lower!),
    filtered: filtered,
    metadata,
  };

  return newFileTreeNode
}

export const resolveTreeStructure = (
  currentFileTreeNode: FileTreeNode,
  newMetadata: Metadata[],
  fileTreeName: FileTreeName,
  rootPath: string,
  noFilter?: boolean,
  genericTags?: TagSystem,
): FileTreeNode => {
  const currentHead = currentFileTreeNode.path;
  const newFileTreeNode = { ...currentFileTreeNode }

  const children: FileTreeNode[] = newMetadata
    .map((metadata) => {
      const currentHeadLength = currentHead.split("/").filter(Boolean).length;

      const metadataPath = getMetadataPath(rootPath, metadata.path_lower!);
      const metadataLength = metadataPath.split("/").filter(Boolean).length;

      const parentFolder = metadataPath.replace(/\/[^/]*$/, "");

      if (
        (currentHeadLength === 0 && metadataLength === 1) ||
        parentFolder === currentHead
      ) {
        let newFileTreeNode: FileTreeNode = {
          name: metadata.name,
          fileTreeName,
          tag: metadata[".tag"],
          path: getMetadataPath(rootPath, metadata.path_lower!),
          filtered: !!noFilter ? true : false,
          metadata,
        };

        if (newFileTreeNode.tag === "file" && genericTags) {
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
              console.error(e) //TODO: remove for production
            }
          }
        }

        if (newFileTreeNode.tag === "folder") {
          newFileTreeNode = resolveTreeStructure(
            newFileTreeNode,
            newMetadata,
            fileTreeName,
            rootPath,
            noFilter,
            genericTags
          );
        }

        return newFileTreeNode;
      }

      return null;
    })
    .filter((child) => !!child)

  if (currentFileTreeNode.path !== "/" || currentFileTreeNode.fileTreeName !== 'inGameFootage')
    children.sort((a, b) => {
      // 1. Sort by tag (folders first)
      if (a.tag !== b.tag) {
        return a.tag === "folder" ? -1 : 1;
      }

      // 2. Extract number from name using regex /_(\d+)\.\d+$/
      const getNumber = (name: string) => {
        const match = name.match(/_(\d+)\.\d+$/);
        return match ? parseInt(match[1], 10) : null;
      };

      const numA = getNumber(a.name);
      const numB = getNumber(b.name);

      // 3. Sort by extracted number if both have a valid number
      if (numA !== null && numB !== null) {
        return numA - numB;
      }

      // 4. If only one has a number, prioritize the one with a number
      if (numA !== null) return -1;
      if (numB !== null) return 1;

      // 5. Sort alphabetically if no numbers are found
      return a.name.localeCompare(b.name);
    });

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

const getMetadataPath = (rootPath: string, path: string) => {
  return path.replace(rootPath.toLowerCase(), "");
};