var CSInterfaceX = {
  projectItems: {}
}

function findProjectItemByNodeId(nodeId, parentItem, referenceId) {
  if (!parentItem) {
    parentItem = app.project.rootItem;
  }
  if (parentItem.nodeId === nodeId) {
    CSInterfaceX.projectItems[referenceId] = parentItem
    return parentItem;
  }

  for (var i = 0; i < parentItem.children.numItems; i++) {
    var projectItem = parentItem.children[i];

    if (projectItem.nodeId === nodeId) {
      CSInterfaceX.projectItems[referenceId] = projectItem
      return JSON.stringify({
        name: projectItem.name,
        nodeId: projectItem.nodeId,
        type: projectItem.type,
      });
    }

    if (projectItem.type === ProjectItemType.BIN) {
      var foundItem = getProjectItemByNodeId(nodeId, projectItem);
      if (foundItem) {
        CSInterfaceX.projectItems[referenceId] = foundItem
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

function getProjectItemBySourcePath(filePath) {
  if (!parentItem) {
    parentItem = app.project.rootItem;
  }

  for (var i = 0; i < parentItem.children.numItems; i++) {
    var projectItem = parentItem.children[i];

    var projectItemMediaPath = projectItem.getMediaPath();
    if (!projectItemMediaPath) continue;

    if (projectItemMediaPath === filePath) {
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

function getRootItem(referenceId) {
  CSInterfaceX.projectItems[referenceId] = app.project.rootItem
  var response = {
    name: app.project.rootItem.name,
    nodeId: app.project.rootItem.nodeId,
    type: app.project.rootItem.type,
  };
  return JSON.stringify(response);
}

function createBin(name, ParentNodeId, referenceId) {
  var parentProjectItem = findProjectItemByNodeId(ParentNodeId);
  if (parentProjectItem) {
    var createdBin = parentProjectItem.createBin(name);
    CSInterfaceX.projectItems[referenceId] = createdBin
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
