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
      alignItems: 'center',
      justifyContent:'end',
      gridGap: '1rem',
      margin: '1rem'
    }}>
      <label>{title}</label>
      <input
        type="text"
        ref={projectLinkRef}
        value={url}
        readOnly
        style={{ width: '24rem' }}
      />
      <div
        onClick={copyToClipboard}
        style={{
          display: 'inline-block',
          padding: '0.3rem 0.6rem',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer',
          borderRadius: '0.3rem',
          userSelect: 'none',
        }}
      >
        Copy
      </div>
    </div>
  );
};
