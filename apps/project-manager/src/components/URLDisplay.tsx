import React, { useRef } from 'react';

interface URLDisplayProps {
  title: string;
  url: string;
}

export const URLDisplay: React.FC<URLDisplayProps> = ({ title, url }) => {
  const projectLinkRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = () => {
    if (projectLinkRef.current) {
      projectLinkRef.current.select();
      navigator.clipboard.writeText(projectLinkRef.current.value);

    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, auto)',
      alignItems: 'center'
    }}>
      <h2>{title}</h2>
      <input
        type="text"
        ref={projectLinkRef}
        value={url}
        readOnly
        style={{ marginRight: '10px' }}
      />
      <div
        onClick={copyToClipboard}
        style={{
          display: 'inline-block',
          padding: '5px 10px',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer',
          borderRadius: '5px',
          userSelect: 'none',
        }}
      >
        Copy
      </div>
    </div>
  );
};
