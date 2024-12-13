import { createSelector } from "reselect";
import { RootState } from "../store";
import { FileTreeNode } from "../../types/app";

const selectFileTree = (state: RootState) => state.fileTree.fileTree;
const selectActiveTags = (state: RootState) => state.tags.activeTags;
const selectFilterByTags = (state: RootState) => state.tags.filterByTags;

export const selectFilteredFileTree = createSelector(
  [selectFileTree, selectActiveTags, selectFilterByTags],
  (fileTree, activeTags, filterByTags) => {
    const filterTree = (fileTreeNode: FileTreeNode): FileTreeNode | null => {
      if (fileTreeNode.tag === "file") {
        return activeTags.some((tag) => fileTreeNode.tagList?.includes(tag)) ? fileTreeNode : null;
      }

      if (fileTreeNode.tag === "folder") {
        const filteredChildren = fileTreeNode.children
          ?.map(filterTree)
          .filter(entry => !!entry);

        if(!filteredChildren) return null;
        return filteredChildren.length > 0
          ? { ...fileTreeNode, children: filteredChildren }
          : null;
      }

      return null;
    };
    if(filterByTags) return filterTree(fileTree);
    return fileTree
  }
);
