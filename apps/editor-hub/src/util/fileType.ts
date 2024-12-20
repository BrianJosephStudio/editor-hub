const mimeMapping = {
    audio: ['.mp3', '.wav', '.aac', '.ogg', '.flac'],
    video: ['.mp4', '.avi', '.mov', '.mkv', '.wmv'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
  };
  
  export const getMimeType = (fileName: string) =>  {
    const ext = fileName.split('.').pop()?.toLowerCase();
  
    if (mimeMapping.audio.includes(`.${ext}`)) return 'audio';
    if (mimeMapping.video.includes(`.${ext}`)) return 'video';
    if (mimeMapping.image.includes(`.${ext}`)) return 'image';
  
    return 'unknown';
  }