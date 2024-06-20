// import React, { useState, useEffect } from 'react'
import "./FileIcon.css";
import videoFileIcon from '../../../../assets/videoIcon.svg'
import { useEffect, useRef, useState } from "react";
import { ApiClient } from "../../../../api/ApiClient";
import { useClipViewer } from "../../../../context/ClipViewerContext";

export const FileIcon = ({
  name,
  path,
  id,
  active,
  clickCallback,
  openFileCallback,
}: {
  name: string;
  path: string;
  id: number;
  active: boolean;
  clickCallback: () => void;
  openFileCallback: (temporaryLink: string) => void;
}) => {
  const folderElement = useRef<HTMLDivElement>(null)
  const [ localTemporaryLink, setLocalTemporaryLink ] = useState<string>()
  const [ cachedFile, setCachedFile ] = useState<string>()

  const apiClient = new ApiClient()

  useEffect(() => {
    if (active && folderElement.current) {
        folderElement.current.focus()
    }
  }, [active])
  
  useEffect(() => {
    if(!folderElement.current) return
    folderElement.current.blur()
  }, [id])

  useEffect(() => {
    apiClient.getTemporaryLink(path)
    .then((link) => setLocalTemporaryLink(link))
    .catch((e) => console.error(e))
  }, [])
  
  return (
    <div
      ref={folderElement}
      className={`folderContainer ${
        active ? "folderContainerActive" : "folderContainerInactive"
      }`}
      onDoubleClick={(event) => {
        event.preventDefault();
        if(!localTemporaryLink) return
        openFileCallback(localTemporaryLink);
      }}
      onClick={clickCallback}
    >
      <img
      style={{
        maxWidth: '3rem'
      }}
      src={videoFileIcon}
      alt=""
      />
      {name}
    </div>
  );
};
