// ---------------- Universal Compare ----------------
function compare(a, b) {
  // If both are numbers (or numeric strings that parse to numbers) prefer numeric compare
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) {
    if (na === nb) return 0;
    return na < nb ? -1 : 1;
  }

  const A = String(a);
  const B = String(b);
  if (A === B) return 0;
  return A < B ? -1 : 1;
}

// ---------------- TreeNode ----------------
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null; // used by RB and optionally set in AVL
    this.color = "red"; // For RBTree
    this.height = 1;    // For AVL
    this.count = 1;     // For BST duplicates
  }
}

// ---------------- Binary Search Tree (BST) ----------------
class BST {
  constructor() {
    this.root = null;
  }

  add(value) {
    if (!this.root) {
      this.root = new TreeNode(value);
      return this.root;
    }

    let current = this.root;
    while (true) {
      const cmp = compare(value, current.value);

      if (cmp === 0) {
        current.count += 1; // allow duplicates
        return current;
      }
      if (cmp < 0) {
        if (!current.left) {
          const node = new TreeNode(value);
          current.left = node;
          node.parent = current;
          return node;
        }
        current = current.left;
      } else {
        if (!current.right) {
          const node = new TreeNode(value);
          current.right = node;
          node.parent = current;
          return node;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;
    while (current) {
      const cmp = compare(value, current.value);
      if (cmp === 0) return current;
      current = cmp < 0 ? current.left : current.right;
    }
    return null;
  }

  remove(value) {
    const removeNode = (node, value) => {
      if (!node) return null;

      const cmp = compare(value, node.value);
      if (cmp < 0) {
        node.left = removeNode(node.left, value);
        if (node.left) node.left.parent = node;
      } else if (cmp > 0) {
        node.right = removeNode(node.right, value);
        if (node.right) node.right.parent = node;
      } else {
        if (node.count > 1) {
          node.count -= 1;
          return node;
        }
        if (!node.left) {
          if (node.right) node.right.parent = node.parent;
          return node.right;
        }
        if (!node.right) {
          if (node.left) node.left.parent = node.parent;
          return node.left;
        }

        // Node with two children: replace with inorder successor
        let minNode = node.right;
        while (minNode.left) minNode = minNode.left;
        node.value = minNode.value;
        node.count = minNode.count;
        minNode.count = 1;
        node.right = removeNode(node.right, minNode.value);
        if (node.right) node.right.parent = node;
      }
      return node;
    };

    this.root = removeNode(this.root, value);
    if (this.root) this.root.parent = null;
  }
}

// ---------------- AVL Tree ----------------
class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  updateHeight(node) {
    if (!node) return;
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  // Attach child 'child' to parent 'parent' on the correct side
  attachToParent(parent, child) {
    if (!parent) return;
    if (compare(child.value, parent.value) < 0) parent.left = child;
    else parent.right = child;
    if (child) child.parent = parent;
  }

  // left rotation: x becomes left child of its right child y
  leftRotate(x) {
    const y = x.right;
    if (!y) return x; // nothing to rotate

    const parent = x.parent; // grandparent
    x.right = y.left;
    if (y.left) y.left.parent = x;

    y.left = x;
    x.parent = y;

    // attach y to x's former parent
    y.parent = parent;
    if (!parent) {
      this.root = y;
    } else if (parent.left === x) {
      parent.left = y;
    } else {
      parent.right = y;
    }

    // update heights
    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  // right rotation: y becomes right child of its left child x
  rightRotate(y) {
    const x = y.left;
    if (!x) return y;

    const parent = y.parent;
    y.left = x.right;
    if (x.right) x.right.parent = y;

    x.right = y;
    y.parent = x;

    // attach x to y's former parent
    x.parent = parent;
    if (!parent) {
      this.root = x;
    } else if (parent.left === y) {
      parent.left = x;
    } else {
      parent.right = x;
    }

    // update heights
    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  add(value) {
    const insert = (node, value, parent = null) => {
      if (!node) {
        const nn = new TreeNode(value);
        nn.parent = parent;
        return nn;
      }

      const cmp = compare(value, node.value);
      if (cmp === 0) {
        // duplicates not allowed in this AVL implementation
        return node;
      }
      if (cmp < 0) node.left = insert(node.left, value, node);
      else node.right = insert(node.right, value, node);

      // ensure children's parent pointers are correct (defensive)
      if (node.left) node.left.parent = node;
      if (node.right) node.right.parent = node;

      this.updateHeight(node);
      const balance = this.height(node.left) - this.height(node.right);

      // Left Left
      if (balance > 1 && compare(value, node.left.value) < 0) {
        return this.rightRotate(node);
      }

      // Right Right
      if (balance < -1 && compare(value, node.right.value) > 0) {
        return this.leftRotate(node);
      }

      // Left Right
      if (balance > 1 && compare(value, node.left.value) > 0) {
        node.left = this.leftRotate(node.left);
        if (node.left) node.left.parent = node;
        return this.rightRotate(node);
      }

      // Right Left
      if (balance < -1 && compare(value, node.right.value) < 0) {
        node.right = this.rightRotate(node.right);
        if (node.right) node.right.parent = node;
        return this.leftRotate(node);
      }

      return node;
    };

    this.root = insert(this.root, value, null);
    if (this.root) this.root.parent = null;
    return this.search(value);
  }

  search(value) {
    let current = this.root;
    while (current) {
      const cmp = compare(value, current.value);
      if (cmp === 0) return current;
      current = cmp < 0 ? current.left : current.right;
    }
    return null;
  }

  remove(value) {
    const removeNode = (node, value) => {
      if (!node) return null;

      const cmp = compare(value, node.value);
      if (cmp < 0) node.left = removeNode(node.left, value);
      else if (cmp > 0) node.right = removeNode(node.right, value);
      else {
        // found
        if (!node.left) {
          if (node.right) node.right.parent = node.parent;
          return node.right;
        }
        if (!node.right) {
          if (node.left) node.left.parent = node.parent;
          return node.left;
        }

        // two children - use inorder successor
        let minNode = node.right;
        while (minNode.left) minNode = minNode.left;
        node.value = minNode.value;
        node.right = removeNode(node.right, minNode.value);
        if (node.right) node.right.parent = node;
      }

      // update height and rebalance
      this.updateHeight(node);
      const balance = this.height(node.left) - this.height(node.right);

      if (balance > 1 && this.height(node.left.left) >= this.height(node.left.right)) return this.rightRotate(node);
      if (balance > 1 && this.height(node.left.left) < this.height(node.left.right)) {
        node.left = this.leftRotate(node.left);
        if (node.left) node.left.parent = node;
        return this.rightRotate(node);
      }
      if (balance < -1 && this.height(node.right.right) >= this.height(node.right.left)) return this.leftRotate(node);
      if (balance < -1 && this.height(node.right.right) < this.height(node.right.left)) {
        node.right = this.rightRotate(node.right);
        if (node.right) node.right.parent = node;
        return this.leftRotate(node);
      }

      return node;
    };

    this.root = removeNode(this.root, value);
    if (this.root) this.root.parent = null;
  }
}

// ---------------- Red-Black Tree ----------------
class RBTree {
  constructor() {
    this.root = null;
  }

  leftRotate(x) {
    const y = x.right;
    if (!y) return;
    x.right = y.left;
    if (y.left) y.left.parent = x;

    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;

    y.left = x;
    x.parent = y;
  }

  rightRotate(x) {
    const y = x.left;
    if (!y) return;
    x.left = y.right;
    if (y.right) y.right.parent = x;

    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.right) x.parent.right = y;
    else x.parent.left = y;

    y.right = x;
    x.parent = y;
  }

  add(value) {
    if (this.search(value)) return false; // no duplicates
    const newNode = new TreeNode(value);
    newNode.color = "red";

    if (!this.root) {
      newNode.color = "black";
      this.root = newNode;
      return newNode;
    }

    let parent = null;
    let current = this.root;
    while (current) {
      parent = current;
      const cmp = compare(value, current.value);
      current = cmp < 0 ? current.left : current.right;
    }

    newNode.parent = parent;
    if (compare(value, parent.value) < 0) parent.left = newNode;
    else parent.right = newNode;

    this.fixInsert(newNode);
    return newNode;
  }

  fixInsert(node) {
    while (node.parent && node.parent.color === "red") {
      const grandparent = node.parent.parent;
      if (!grandparent) break;

      if (node.parent === grandparent.left) {
        const uncle = grandparent.right;
        if (uncle && uncle.color === "red") {
          node.parent.color = "black";
          uncle.color = "black";
          grandparent.color = "red";
          node = grandparent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.leftRotate(node);
          }
          node.parent.color = "black";
          grandparent.color = "red";
          this.rightRotate(grandparent);
        }
      } else {
        const uncle = grandparent.left;
        if (uncle && uncle.color === "red") {
          node.parent.color = "black";
          uncle.color = "black";
          grandparent.color = "red";
          node = grandparent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rightRotate(node);
          }
          node.parent.color = "black";
          grandparent.color = "red";
          this.leftRotate(grandparent);
        }
      }
    }
    if (this.root) this.root.color = "black";
  }

  search(value) {
    let current = this.root;
    while (current) {
      const cmp = compare(value, current.value);
      if (cmp === 0) return current;
      current = cmp < 0 ? current.left : current.right;
    }
    return null;
  }

  remove(value) {
    // Simplified remove: BST remove + recolor root
    // Note: This does not perform the full RB delete fixups.
    const bst = new BST();
    bst.root = this.root;
    bst.remove(value);
    this.root = bst.root;
    if (this.root) this.root.color = "black";
    if (this.root) this.root.parent = null;
  }
}

export { TreeNode, BST, AVLTree, RBTree };
