class TreeBuilder {
  constructor(options = {}) {
    const _ = this;
    _.data = [];
    _.idKey = options.idKey || 'id';
    _.rowKey = options.rowKey || 'row';
    _.colKey = options.colKey || 'col';

    if (options.data) {
      _.setData(options.data);
    }
  }

  /**
   * Sets and sorts the data by row.
   * @param {Array} data - The array of data to be set and sorted.
   */
  setData(data) {
    const _ = this;
    _.data = data.sort(_.sortByRow.bind(_));
  }

  /**
   * Sorts data by the row key.
   * @param {Object} a - The first item to compare.
   * @param {Object} b - The second item to compare.
   * @returns {number} The sort order.
   * @private
   */
  sortByRow(a, b) {
    const _ = this;
    return a[_.rowKey] - b[_.rowKey];
  }

  /**
   * Retrieves the root nodes.
   * @returns {Array} The array of root nodes.
   */
  getRoots() {
    const _ = this;
    return _.data.filter(item => item[_.colKey] === 0);
  }

  /**
   * Retrieves the parent of a node.
   * @param {Object|string} node - The node or node ID for which to find the parent.
   * @returns {Object|null} The parent node, or null if no parent is found.
   */
  getParent(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }

    const nodeIndex = _.data.indexOf(node);
    if (nodeIndex === -1 || node[_.colKey] === 0) {
      return null;
    }

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (_.data[i][_.colKey] < node[_.colKey]) {
        return _.data[i];
      }
    }

    return null;
  }

  /**
   * Retrieves all parents of a node.
   * @param {Object|string} node - The node or node ID for which to find all parents.
   * @returns {Array} The array of parent nodes.
   */
  getAllParents(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }

    const parents = [];
    while (node && node[_.colKey] > 0) {
      node = _.getParent(node);
      if (node) parents.unshift(node);
    }

    return parents;
  }

  /**
   * Retrieves all descendants of a node.
   * @param {Object|string} node - The node or node ID for which to find all descendants.
   * @returns {Array} The array of descendant nodes.
   */
  getDescendants(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }

    const nodeIndex = _.data.indexOf(node);
    if (nodeIndex === -1) {
      return [];
    }

    const descendants = [];
    const startCol = node[_.colKey];

    for (let i = nodeIndex + 1; i < _.data.length; i++) {
      if (_.data[i][_.colKey] > startCol) {
        descendants.push(_.data[i]);
      } else if (_.data[i][_.colKey] === startCol) {
        break;
      }
    }

    return descendants;
  }

  /**
   * Retrieves the children of a node (no grandchildren).
   * @param {Object|string} node - The node or node ID for which to find children.
   * @returns {Array} The array of child nodes.
   */
  getChildren(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }

    const nodeIndex = _.data.indexOf(node);
    if (nodeIndex === -1) {
      return [];
    }

    const children = [];
    const childCol = node[_.colKey] + 1;

    for (let i = nodeIndex + 1; i < _.data.length; i++) {
      if (_.data[i][_.colKey] === childCol) {
        children.push(_.data[i]);
      } else if (_.data[i][_.colKey] < childCol) {
        break;
      }
    }

    return children;
  }

  /**
   * Retrieves the node with a specific ID.
   * @param {string} id - The ID of the node to retrieve.
   * @returns {Object|null} The node with the specified ID, or null if not found.
   */
  getNodeById(id) {
    const _ = this;
    return _.data.find(item => item[_.idKey] === id) || null;
  }

   /**
   * Gets the index of a root node.
   * @param {Object|string} node - The node or node ID to find the root index for.
   * @returns {number} The index of the root node, or -1 if not found.
   */
  getRootIndex(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }
    if (!node) return -1;
    
    const roots = _.getRoots();
    return roots.findIndex(root => root[_.idKey] === node[_.idKey]);
  }

  /**
   * Gets the root parent of a node.
   * @param {Object|string} node - The node or node ID to find the root parent for.
   * @returns {Object|null} The root parent node, or null if not found.
   */
  getRootParent(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }
    if (!node) return null;
    
    if (node[_.colKey] === 0) return node;
    
    let parent = _.getParent(node);
    while (parent && parent[_.colKey] !== 0) {
      parent = _.getParent(parent);
    }
    return parent;
  }

  /**
   * Gets the deepest descendant column value for a node.
   * @param {Object|string} node - The node or node ID to find the deepest descendant for.
   * @returns {number} The column value of the deepest descendant.
   */
  getDeepestDescendantColumnValue(node) {
    const _ = this;
    if (node === 0) return Math.max(..._.data.map(item => item[_.colKey]));
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }
    if (!node) return -1;

    const descendants = _.getDescendants(node);
    if (descendants.length === 0) return node[_.colKey];
    
    return Math.max(...descendants.map(item => item[_.colKey]));
  }

  /**
   * Gets all siblings of a node.
   * @param {Object|string} node - The node or node ID to find siblings for.
   * @returns {Array} An array of sibling nodes.
   */
  getAllSiblings(node) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }
    if (!node) return [];
    
    if (node[_.colKey] === 0) return _.getRoots();
    
    const parent = _.getParent(node);
    return parent ? _.getChildren(parent) : [];
  }

  /**
   * Shifts a node to a new position.
   * @param {Object|string} node - The node or node ID to shift.
   * @param {number} newCol - The new column value.
   * @param {number} newRow - The new row value.
   */
  shiftNode(node, newCol, newRow) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }
    if (!node) return;

    node[_.colKey] = newCol;
    node[_.rowKey] = newRow;
    _.sortDataByRow();
  }

   /**
   * Shifts a node and all its children to a new position, adjusting other nodes as necessary.
   * @param {Object|string} node - The node or node ID to shift.
   * @param {number} newCol - The new column value for the node.
   * @param {number} newRow - The new row value for the node.
   */
  shiftNodeWithChildren(node, newCol, newRow) {
    const _ = this;
    if (typeof node === 'string') {
      node = _.getNodeById(node);
    }
    if (!node) return;

    const oldIndex = _.data.indexOf(node);
    if (oldIndex === -1) return;

    const colDiff = Math.max(0, newCol) - node[_.colKey];
    const rowDiff = newRow - node[_.rowKey];
    const descendants = _.getDescendants(node);
    const nodesToShift = [node, ...descendants];
    const shiftSize = nodesToShift.length;

    // Determine shift direction
    const isForwardShift = newRow > node[_.rowKey];

    // Remove the node and its descendants from the current position
    _.data.splice(oldIndex, shiftSize);

    // Update the node and its descendants
    nodesToShift.forEach(n => {
      n[_.colKey] = Math.max(0, n[_.colKey] + colDiff);
      n[_.rowKey] += rowDiff;
    });

    // Find the new insertion index
    let insertionIndex;
    if (isForwardShift) {
      insertionIndex = _.data.findIndex(item => item[_.rowKey] > newRow);
      if (insertionIndex === -1) insertionIndex = _.data.length;
    } else {
      insertionIndex = _.data.findIndex(item => item[_.rowKey] >= newRow);
      if (insertionIndex === -1) insertionIndex = _.data.length;
    }

    // Insert the updated nodes at the new position
    _.data.splice(insertionIndex, 0, ...nodesToShift);

    // Update rows for all nodes
    _.data.forEach((item, index) => {
      item[_.rowKey] = index;
    });

    _.sortDataByRow();
  }

  /**
   * Normalizes the tree structure by left-aligning nodes.
   */
  normalizeTree() {
    const _ = this;
    
    // Helper function to get the correct column for a node
    const getCorrectColumn = (node, index) => {
      if (index === 0 || node[_.colKey] === 0) return 0;
      
      const parent = _.getParent(node);
      if (parent) {
        return parent[_.colKey] + 1;
      }
      
      return 0;
    };

    // Traverse the tree and adjust column values
    _.data.forEach((node, index) => {
      const correctColumn = getCorrectColumn(node, index);
      if (node[_.colKey] !== correctColumn) {
        const colDiff = correctColumn - node[_.colKey];
        node[_.colKey] = correctColumn;
        
        // Adjust all descendants
        const descendants = _.getDescendants(node);
        descendants.forEach(desc => {
          desc[_.colKey] += colDiff;
        });
      }
    });

    // Final sort to ensure correct order
    _.sortDataByRow();
  }


  /**
   * Gets the index of a node with a specific ID.
   * @param {string} id - The ID of the node to find.
   * @returns {number} The index of the node, or -1 if not found.
   */
  getIndexofNodeWithId(id) {
    const _ = this;
    return _.data.findIndex(item => item[_.idKey] === id);
  }

  /**
   * Converts the hierarchy to a string representation.
   * @returns {string} The string representation of the hierarchy.
   */
  toString() {
    const _ = this;
    return _.data
      .sort(_.sortByRow.bind(_))
      .map(item => `${'|   '.repeat(item[_.colKey])}${item[_.idKey]}`)
      .join('\n');
  }

  /**
   * Logs the hierarchy to the console.
   */
  log() {
    const _ = this;
    console.log(_.toString());
  }
}

// Conditional export as Universal Module
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (Node.js) export
    module.exports = TreeBuilder;
} else if (typeof define === 'function' && define.amd) {
    // AMD (RequireJS) export
    define([], () => TreeBuilder);
} else if (typeof window !== 'undefined') {
    // Browser global export
    window.TreeBuilder = TreeBuilder;
}