interface ResponseObject {
  value: string;
  success: boolean;
}

export const parseResponseObject = (responseObject: string) => {
  try {
    const parsedResponse = JSON.parse(responseObject);
    if (!parsedResponse.success)
      throw "ResponseObject does not match expected schema";
    return parsedResponse as ResponseObject;
  } catch (e) {
    console.error(e);
    throw new Error(
      "Something went wrong when attempting to parse response from ExtendScript"
    );
  }
};


