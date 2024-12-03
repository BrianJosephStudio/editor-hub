export const mockOs = {
    homedir: () => "Mock Home Directory",
    platform: () => "Mock Platform",
    arch: () => "Mock Architecture",
  };
  
  export const mockFsPromises = {
    readFile: async (path: string, _encoding: string) =>
      Promise.resolve(`Mock file content from ${path}`),
    writeFile: async (path: string, data: string, _encoding: string) =>
      Promise.resolve(console.log(`Mock write to ${path} with data: ${data}`)),
    stat: async (path: string) =>
      Promise.resolve({
        isFile: () => true,
        isDirectory: () => false,
        size: 1024,
      }),
    unlink: async (path: string) =>
      Promise.resolve(console.log(`Mock file removed at ${path}`)),
    mkdir: async (path: string, options?: { recursive?: boolean }) =>
      Promise.resolve(console.log(`Mock folder created at ${path} with options: ${JSON.stringify(options)}`)),
    rmdir: async (path: string) =>
      Promise.resolve(console.log(`Mock folder removed at ${path}`)),
  };
  
  export const mockPath = {
    join: (...segments: string[]) => segments.join("/"),
    resolve: (...segments: string[]) =>
      `/mock/resolved/${segments.join("/")}`,
    dirname: (filePath: string): string => {
      // Use a regular expression or string manipulation to mock path.dirname
      const normalizedPath = filePath.replace(/\\/g, '/'); // Handle Windows-style paths
      const lastSlashIndex = normalizedPath.lastIndexOf('/');
  
      if (lastSlashIndex === -1) {
        // If no slash is found, assume no directory and return '.'
        return '.';
      }
  
      return normalizedPath.substring(0, lastSlashIndex) || '/';
    },
  };
  