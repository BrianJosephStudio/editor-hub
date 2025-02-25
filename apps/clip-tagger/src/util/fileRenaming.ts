import { Metadata } from "@editor-hub/dropbox-types";
import { ParsedFileName } from "./dropboxFileParsing";

export const getNextAvailableIndex = (folderEntries: Metadata[]) => {
    const currentIndexes = folderEntries.map((folderEntry) => {
        const parsedFileName = new ParsedFileName(folderEntry.path_lower!, 0);

        if (parsedFileName.isProperlyNamed) {
            return parsedFileName.index;
        } else {
            return null;
        }
    }).filter((data) => data !== null);

    return Math.max(-1, ...currentIndexes) + 1;
}