import { createSelector } from "reselect";
import { RootState } from "../store";
import { FileTreeNode } from "../../types/app";

const selectFileTree = (state: RootState) => state.fileTree.fileTree;
const selectActiveTags = (state: RootState) => state.tags.activeTags;

export const selectFilteredFileTree = createSelector(
  [selectFileTree, selectActiveTags],
  (fileTree, activeTags) => {
    const filterTree = (fileTreeNode: FileTreeNode): FileTreeNode => {
      if (fileTreeNode.tag === "file") {
        const isIncluded = activeTags.some((tag) => fileTreeNode.tagList?.includes(tag));
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
