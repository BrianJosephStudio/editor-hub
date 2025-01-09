function _createResponseObject(value, success) {
  try {
    var response = {
      value: value,
      success: success,
    };
    return JSON.stringify(response);
  } catch (e) {
    return _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _folderItem_items(id) {
  try {
    var folderItem = app.project.itemByID(id);
    var value = JSON.stringify(folderItem.items);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    var response = _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _ItemCollection_addComp(
  parentItemId,
  name,
  width,
  height,
  pixelAspect,
  duration,
  framerate
) {
  try {
    var parentItem = app.project.itemByID(parentItemId);
    var createdcomp = parentItem.items.addComp(
      name,
      width,
      height,
      pixelAspect,
      duration,
      framerate
    );
    var value = JSON.stringify(createdcomp);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    var response = _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _ItemCollection_addFolder(parentItemId, name) {
  try {
    var parentItem = app.project.itemByID(parentItemId);
    var createdFolder = parentItem.items.addFolder(name);
    var value = JSON.stringify(createdFolder);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    var response = _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _Item_setParentFolder(itemId, parentFolderId) {
  try {
    var item = app.project.itemByID(itemId);
    var parentFolder = app.project.itemByID(parentFolderId);
    item.parentFolder = parentFolder;
    var response = _createResponseObject(null, true);
    return response;
  } catch (e) {
    var response = _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _Project_importFile(path) {
  try {
    var file = new File(path);
    var importOptions = new ImportOptions(file);
    var importedItem = app.project.importFile(importOptions);
    var value = JSON.stringify(importedItem);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    var response = _createResponseObject(e, false);
  }
}
