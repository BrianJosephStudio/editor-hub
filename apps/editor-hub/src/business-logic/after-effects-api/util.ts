import { AVItem } from "./AVItem";
import { CompItem } from "./CompItem";
import { FolderItem } from "./FolderItem";
import { FootageItem } from "./FootageItem";
import { Item } from "./Item";
import {
  CompItemProps,
  FolderItemProps,
  FootageItemProps,
  TypeName,
} from "./types";

interface ResponseObject {
  value: string;
  success: boolean;
}

export const parseResponseObject = (responseObject: string) => {
  try {
    const parsedResponse = JSON.parse(responseObject);
    if (!parsedResponse.value || parsedResponse.success === null)
      throw "ResponseObject does not match expected schema";
    return parsedResponse as ResponseObject;
  } catch (e) {
    console.error(e);
    throw new Error(
      "Something went wrong when attempting to parse response from ExtendScript"
    );
  }
};


