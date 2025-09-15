// ---------------- Universal Compare ----------------
function compare(a, b) {
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
    this.parent = null; // For RBTree
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
          current.left = new TreeNode(value);
          return current.left;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = new TreeNode(value);
          return current.right;
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
      if (cmp < 0) node.left = removeNode(node.left, value);
      else if (cmp > 0) node.right = removeNode(node.right, value);
      else {
        if (node.count > 1) {
          node.count -= 1;
          return node;
        }
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Node with two children
        let minNode = node.right;
        while (minNode.left) minNode = minNode.left;
        node.value = minNode.value;
        node.count = minNode.count;
        minNode.count = 1;
        node.right = removeNode(node.right, minNode.value);
      }
      return node;
    };

    this.root = removeNode(this.root, value);
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
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  leftRotate(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.left = x;
    y.parent = x.parent;
    x.parent = y;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  rightRotate(y) {
    const x = y.left;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.right = y;
    x.parent = y.parent;
    y.parent = x;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  add(value) {
    const insert = (node, value) => {
      if (!node) return new TreeNode(value);

      const cmp = compare(value, node.value);
      if (cmp === 0) return node; // duplicates not allowed
      if (cmp < 0) node.left = insert(node.left, value);
      else node.right = insert(node.right, value);

      this.updateHeight(node);
      const balance = this.balanceFactor(node);

      if (balance > 1 && compare(value, node.left.value) < 0) return this.rightRotate(node);
      if (balance < -1 && compare(value, node.right.value) > 0) return this.leftRotate(node);
      if (balance > 1 && compare(value, node.left.value) > 0) {
        node.left = this.leftRotate(node.left);
        return this.rightRotate(node);
      }
      if (balance < -1 && compare(value, node.right.value) < 0) {
        node.right = this.rightRotate(node.right);
        return this.leftRotate(node);
      }

      return node;
    };

    this.root = insert(this.root, value);
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
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let minNode = node.right;
        while (minNode.left) minNode = minNode.left;
        node.value = minNode.value;
        node.right = removeNode(node.right, minNode.value);
      }

      this.updateHeight(node);
      const balance = this.balanceFactor(node);

      if (balance > 1 && this.balanceFactor(node.left) >= 0) return this.rightRotate(node);
      if (balance > 1 && this.balanceFactor(node.left) < 0) {
        node.left = this.leftRotate(node.left);
        return this.rightRotate(node);
      }
      if (balance < -1 && this.balanceFactor(node.right) <= 0) return this.leftRotate(node);
      if (balance < -1 && this.balanceFactor(node.right) > 0) {
        node.right = this.rightRotate(node.right);
        return this.leftRotate(node);
      }

      return node;
    };

    this.root = removeNode(this.root, value);
  }
}

// ---------------- Red-Black Tree ----------------
class RBTree {
  constructor() {
    this.root = null;
  }

  leftRotate(x) {
    const y = x.right;
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
    this.root.color = "black";
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
    const bst = new BST();
    bst.root = this.root;
    bst.remove(value);
    this.root = bst.root;
    if (this.root) this.root.color = "black";
  }
}

export { TreeNode, BST, AVLTree, RBTree };
