// import React, { useState, useEffect } from 'react'
import "./FolderIcon.css";
import folderIcon from "../../../../assets/folderIcon.svg";
import { useEffect, useRef } from "react";

export const FolderIcon = ({
  name,
  id,
  active,
  clickCallback,
  openFolderCallback,
}: {
  name: string;
  path: string;
  id: number;
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
    <div
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
    </div>
  );
};
