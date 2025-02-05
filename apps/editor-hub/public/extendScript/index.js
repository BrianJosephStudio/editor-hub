if (!CSInterfaceX) {
  var CSInterfaceX = {
    projectItems: {},
    temp: {}
  }
}

function findProjectItemByNodeId(nodeId, parentItem, referenceId) {
  if (!parentItem) {
    parentItem = app.project.rootItem;
  }
  if (parentItem.nodeId === nodeId) {
    saveProjectItemTempReference(referenceId, parentItem)
    return parentItem;
  }

  for (var i = 0; i < parentItem.children.numItems; i++) {
    var projectItem = parentItem.children[i];

    if (projectItem.nodeId === nodeId) {
      saveProjectItemTempReference(referenceId, projectItem)
      return JSON.stringify({
        name: projectItem.name,
        nodeId: projectItem.nodeId,
        type: projectItem.type,
      });
    }

    if (projectItem.type === ProjectItemType.BIN) {
      var foundItem = getProjectItemByNodeId(nodeId, projectItem);
      if (foundItem) {
        saveProjectItemTempReference(referenceId, foundItem)
        return JSON.stringify({
          name: foundItem.name,
          nodeId: foundItem.nodeId,
          type: foundItem.type,
        });
      }
    }
  }

  return null;
}

function getProjectItemByNodeId(nodeId, parentItem) {
  if (!parentItem) {
    parentItem = app.project.rootItem;
  }
  if (parentItem.nodeId === nodeId) {
    return parentItem;
  }

  for (var i = 0; i < parentItem.children.numItems; i++) {
    var projectItem = parentItem.children[i];

    if (projectItem.nodeId === nodeId) {
      return projectItem;
    }

    if (projectItem.type === ProjectItemType.BIN) {
      var foundItem = getProjectItemByNodeId(nodeId, projectItem);
      if (foundItem) {
        return foundItem;
      }
    }
  }

  return null;
}

function getProjectItemBySourcePath(filePath, referenceId, parentProjectItem) {
  if (!parentProjectItem) {
    parentProjectItem = app.project.rootItem;
  }

  for (var i = 0; i < parentProjectItem.children.numItems; i++) {
    var projectItem = parentProjectItem.children[i];


    var projectItemMediaPath = projectItem.getMediaPath();
    if (projectItemMediaPath && projectItemMediaPath.replace(/\\/g, "/") === filePath) {
      saveProjectItemTempReference(referenceId, projectItem)
      return JSON.stringify({
        name: projectItem.name,
        nodeId: projectItem.nodeId,
        type: projectItem.type,
      });
    }


    if (projectItem.type === 2) {
      var foundItem = getProjectItemBySourcePath(filePath, referenceId, projectItem);
      if (foundItem) {
        return foundItem;
      }
    }
  }

  return null;
}

function getRootItem(referenceId) {
  saveProjectItemTempReference(referenceId, app.project.rootItem)
  var response = {
    name: app.project.rootItem.name,
    nodeId: app.project.rootItem.nodeId,
    type: app.project.rootItem.type,
  };
  return JSON.stringify(response);
}

function createBin(name, parentNodeReferenceId, referenceId) {
  var parentProjectItem = getProjectItemReference(parentNodeReferenceId)
  if (parentProjectItem) {
    var createdBin = parentProjectItem.createBin(name);
    saveProjectItemTempReference(referenceId, createdBin)
    var response = { success: true, message: "", nodeId: createdBin.nodeId };
    return JSON.stringify(response);
  } else {
    var response = {
      success: false,
      message: "Parent ProjectItem could not be found",
    };
    return JSON.stringify(response);
  }
}

function importFile(
  filePath,
  supressUI,
  targetBinNodeId,
  importAsNumberedStills
) {
  try {
    var targetBin = getProjectItemByNodeId(targetBinNodeId);
    app.project.importFiles(
      filePath,
      supressUI,
      targetBin,
      importAsNumberedStills
    );
    return JSON.stringify({
      success: true,
      message: "",
    });
  } catch (e) {
    return JSON.stringify({
      success: false,
      message: e.message,
    });
  }
}

function getProjectItemChildren(referenceId) {
  var parentProjectItem = getProjectItemReference(referenceId)
  if (!parentProjectItem) throw new Error("Parent not found");
  var children = parentProjectItem.children
  var outputChildren = []

  for (var i = 0; i < children.length; i++) {
    var child = children[i]
    outputChildren.push({
      name: child.name,
      nodeId: child.nodeId,
      type: child.type
    })
  }
  return JSON.stringify(outputChildren)
}

function getChildByName(name, parentReferenceId, childReferenceId) {
  var parentProjectItem = getProjectItemReference(parentReferenceId)
  var children = parentProjectItem.children
  for (var i = 0; i < children.length; i++) {
    var child = children[i]
    if (child.name === name) {
      saveProjectItemTempReference(childReferenceId, child)
      return JSON.stringify(child)
    }
  }
  return undefined
}

function saveProjectItemTempReference(referenceId, projectItem) {
  CSInterfaceX.temp[referenceId] = projectItem
}

function getProjectItemTempReference(referenceId) {
  return CSInterfaceX.temp[referenceId]
}

function deleteProjectItemTempReference(referenceId) {
  delete CSInterfaceX.temp[referenceId]
}

function saveProjectItemReference(referenceId) {
  CSInterfaceX.projectItems[referenceId] = getProjectItemTempReference(referenceId)
  deleteProjectItemTempReference(referenceId)
}

function getProjectItemReference(referenceId) {
  return CSInterfaceX.projectItems[referenceId]
}

function deleteProjectItemReference(referenceId) {
  delete CSInterfaceX.projectItems[referenceId]
}

function _Project_getProjectPath() {
  return app.project.path
}