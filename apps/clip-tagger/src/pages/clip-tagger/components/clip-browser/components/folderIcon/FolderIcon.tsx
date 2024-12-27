// import React, { useState, useEffect } from 'react'
import "./FolderIcon.css";
import folderIcon from "../../../../../../assets/folderIcon.svg";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

export const FolderIcon = ({
  name,
  id,
  active,
  clickCallback,
  openFolderCallback,
}: {
  name: string;
  path: string;
  id: string;
  active: boolean;
  clickCallback: () => void;
  openFolderCallback: () => void;
}) => {
  const folderElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active && folderElement.current) {
        folderElement.current.focus()
    }
  }, [active])
  
  useEffect(() => {
    if(!folderElement.current) return
    folderElement.current.blur()
  }, [id])
  
  return (
    <Box
    //   tabIndex={tabIndex}
      ref={folderElement}
      className={`folderContainer ${
        active ? "folderContainerActive" : "folderContainerInactive"
      }`}
      onDoubleClick={(event) => {
        event.preventDefault();
        openFolderCallback();
      }}
      onClick={clickCallback}
    >
      <img src={folderIcon} alt="" />
      {name}
    </Box>
  );
};
