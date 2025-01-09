interface ResponseObject {
    value: any,
    success: boolean
}

export const parseResponseObject = (responseObject: string) => {
    try{
        const parsedResponse = JSON.parse(responseObject)
        if(!parsedResponse.value || parsedResponse.success === null) return null;
        return parsedResponse as ResponseObject
    }catch(e){
        console.error(e)
        return null
    }
}