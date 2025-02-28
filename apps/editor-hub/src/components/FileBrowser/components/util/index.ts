// 🔸 Compress a string and convert it to Base64

import pako from "pako";
import { NodeWrapper } from "../../../../business-logic/node.wrapper";
import { AppPaths } from "../../../../business-logic/AppPaths";

/**
 * Compresses a string using pako.gzip and encodes it in Base64.
 * @param {string} text - The input string to compress.
 * @returns {string} - The compressed and Base64-encoded string.
 */
export function compressText(text: string) {
    // Compress the input text to a Uint8Array
    const compressed = pako.gzip(text);
  
    // Convert the Uint8Array to a Base64 string
    return uint8ArrayToBase64(compressed);
  }
  
  /**
   * Decompresses a Base64-encoded and gzipped string back to the original text.
   * @param {string} base64Compressed - The compressed and Base64-encoded string.
   * @returns {string} - The decompressed original string.
   */
  export function decompressText(base64Compressed: string) {
    // Convert the Base64 string back to a Uint8Array
    const compressed = base64ToUint8Array(base64Compressed);
  
    // Decompress the Uint8Array back to a string
    const decompressed = pako.ungzip(compressed, { to: 'string' });
  
    return decompressed;
  }
  
  /**
   * Converts a Uint8Array to a Base64 string.
   * @param {Uint8Array} uint8Array - The Uint8Array to convert.
   * @returns {string} - The Base64-encoded string.
   */
  export function uint8ArrayToBase64(uint8Array: Uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
  
  /**
   * Converts a Base64 string to a Uint8Array.
   * @param {string} base64 - The Base64 string to convert.
   * @returns {Uint8Array} - The resulting Uint8Array.
   */
  export function base64ToUint8Array(base64: string) {
    const binary = atob(base64);
    const len = binary.length;
    const uint8Array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      uint8Array[i] = binary.charCodeAt(i);
    }
    return uint8Array;
  }

  export async function  downloadTextAsFile(content: string, filename: string): Promise<void> {
    const node = new NodeWrapper()
    const appPaths = new AppPaths()
    if(node.isNodeEnv){
      const name = `${appPaths.licenses}/${filename}` 
      await node.fsPromises?.mkdir(appPaths.licenses, {recursive: true})
      node.fsPromises?.writeFile(name, content, {})
      return
    }
    // Create a Blob from the text content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create an anchor element
    const link = document.createElement('a');
    
    // Create a URL for the Blob and set it as the href of the link
    const url = URL.createObjectURL(blob);
    link.href = url;
    
    // Set the download attribute with the desired filename
    link.download = filename;
  
    // Programmatically click the link to trigger the download
    link.click();
  
    // Clean up the object URL to release memory
    URL.revokeObjectURL(url);
  }