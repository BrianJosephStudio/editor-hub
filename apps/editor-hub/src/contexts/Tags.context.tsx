import React, { createContext, useContext, useState } from 'react';
import { TagGroup, TagObject } from '../types/tags';
import { addActiveTag, removeActiveTag } from '../redux/slices/TagsSlice';
import { useDispatch } from 'react-redux';

interface TagsContextType {
  tagLevel: boolean;
  activeTagGroup: TagGroup | undefined;
  enterTagGroup: (tagGroup: TagGroup) => void;
  exitTagGroup: () => void;
  activateTag: (tagObject: TagObject) => void;
  removeTag: (tagObject: TagObject) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch()
  const [tagLevel, setTagLevel] = useState<boolean>(false);
  const [activeTagGroup, setActiveTagGroup] = useState<TagGroup | undefined>();

  const enterTagGroup = (tagGroup: TagGroup) => {
    setActiveTagGroup(tagGroup);
    setTagLevel(true);
  };

  const exitTagGroup = () => {
    setActiveTagGroup(undefined);
    setTagLevel(false);
  };

  const activateTag = (tagObject: TagObject) => {
    dispatch(addActiveTag(tagObject));
    setTagLevel(false);
  };

  const removeTag = (tagObject: TagObject) => {
    dispatch(removeActiveTag(tagObject));
    setTagLevel(false);
  };

  return (
    <TagsContext.Provider
      value={{
        tagLevel,
        activeTagGroup,
        enterTagGroup,
        exitTagGroup,
        activateTag,
        removeTag,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = (): TagsContextType => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTagsContext must be used within a TagsProvider');
  }
  return context;
};
