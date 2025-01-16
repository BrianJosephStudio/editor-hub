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

function getItemByID(id) {
  if (id === 0) return app.project.rootFolder;
  return app.project.itemByID(id);
}

function _Project_getProjectProperties() {
  try {
    var output = {
      file: app.project.file,
      rootFolder: app.project.rootFolder,
    };
    var value = JSON.stringify(output);
    var responseObject = _createResponseObject(value, true);
    return responseObject;
  } catch (e) {
    return _createResponseObject(e, false);
  }
}

function _folderItem_items(id) {
  try {
    var folderItem = getItemByID(id);
    alert(folderItem)
    alert(folderItem.numItems)
    var value;
    if (folderItem.numItems > 0) {
      var items = [];
      for (var i = 1; i <= folderItem.numItems; i++) {
        alert(folderItem.items[i])
        items.push(folderItem.items[i]);
      }
      alert(items)
      alert(items.length)
      alert(items[0].name)
      value = JSON.stringify([]);
    } else {
      value = JSON.stringify([]);
    }
    alert(value)
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    return _createResponseObject(
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
    var parentItem = getItemByID(parentItemId);
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
    return _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _ItemCollection_addFolder(parentItemId, name) {
  try {
    var parentItem = getItemByID(parentItemId);
    var createdFolder = parentItem.items.addFolder(name);
    var value = JSON.stringify(createdFolder);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    return _createResponseObject(
      e /*might need to use a prop instead?*/,
      false
    );
  }
}

function _Item_setParentFolder(itemId, parentFolderId) {
  try {
    var item = getItemByID(itemId);
    var parentFolder = getItemByID(parentFolderId);
    item.parentFolder = parentFolder;
    var response = _createResponseObject('void', true);
    return response;
  } catch (e) {
    return _createResponseObject(
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

function _CompItem_layers(parentCompId) {
  try {
    var parentCompItem = getItemByID(parentCompId);
    var value = JSON.stringify(parentCompItem.layers);
    var response = _createResponseObject(value, true);
    return response;
  } catch (e) {
    return _createResponseObject(e, false);
  }
}
