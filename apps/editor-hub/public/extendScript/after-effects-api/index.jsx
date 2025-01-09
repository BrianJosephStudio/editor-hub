function _createResponseObject(value, success) {
  try {
    var response = {
      value: value,
      success: success,
    };
    return JSON.stringify(response);
  } catch (e) {
    return _createResponseObject(e/*might need to use a prop instead?*/, false);
  }
}

function _folderItem_items(id) {
  try {
    var folderItem = app.project.itemByID(id);
    var value = JSON.stringify(folderItem.items);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    var response = _createResponseObject(e/*might need to use a prop instead?*/, false);
  }
}
