import { createSelector } from "reselect";
import { RootState } from "../store";
import { FileTreeNode } from "../../types/app";

const selectIngameFootageFileTree = (state: RootState) => state.fileTree.inGameFootageFileTree;
const selectActiveTags = (state: RootState) => state.tags.activeTags;

export const selectFilteredIngameFootageFileTree = createSelector(
  [selectIngameFootageFileTree, selectActiveTags],
  (fileTree, activeTags) => {
    const filterTree = (fileTreeNode: FileTreeNode): FileTreeNode => {
      if (fileTreeNode.tag === "file") {
        const isIncluded = activeTags.every((tag) => fileTreeNode.tagList?.find((fileTag) => fileTag.id === tag.id));
        return {
          ...fileTreeNode,
          filtered: isIncluded,
        };
      }

      if (fileTreeNode.tag === "folder") {
        const filteredChildren = fileTreeNode.children
          ?.map(filterTree)
          .filter(child => !!child);

        return {
          ...fileTreeNode,
          filtered: !!filteredChildren && filteredChildren.some(child => !!child.filtered),
          children: filteredChildren?.length ? filteredChildren : undefined,
        };
      }

      return fileTreeNode;
    };

    return filterTree(fileTree);
  }
);
