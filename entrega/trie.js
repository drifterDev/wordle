class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
      this.count = 0;
    }
  
    insert(word) {
      let node = this.root;
      for (let char of word) {
        if (!(char in node.children)) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      if (!node.isEndOfWord) {
        node.isEndOfWord = true;
        this.count += 1;
      }
    }
  
    search(word) {
      let node = this.root;
      for (let char of word) {
        if (!(char in node.children)) {
          return false;
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    startsWithPrefix(prefix) {
      let node = this.root;
      for (let char of prefix) {
        if (!(char in node.children)) {
          return false;
        }
        node = node.children[char];
      }
      return Object.keys(node.children).length > 0;
    }
  
    delete(word) {
      const q = [];
      let node = this.root;
      for (let char of word) {
        if (!(char in node.children)) {
          return false;
        } else {
          q.push(node);
          node = node.children[char];
        }
      }
      if (Object.keys(node.children).length > 0) {
        node.isEndOfWord = false;
      } else {
        for (let char of word.split('').reverse()) {
          node = q.pop();
          if (node.isEndOfWord || Object.keys(node.children).length > 1) {
            break;
          } else {
            delete node.children[char];
          }
        }
        this.count -= 1;
        return true;
      }
    }
  
    _traverseRecursively(node, currentWord, wordsList) {
      if (node.isEndOfWord) {
        wordsList.push(currentWord);
      }
      for (let [char, childNode] of Object.entries(node.children)) {
        this._traverseRecursively(childNode, currentWord + char, wordsList);
      }
    }
  
    traverse() {
      const wordsList = [];
      this._traverseRecursively(this.root, '', wordsList);
      return wordsList;
    }
  }
  
  // Ejemplo de uso:
  
  const a = new Trie();
  const palabras = ['maria', 'mar', 'marca', 'marte'];
  
  for (let p of palabras) {
    a.insert(p);
  }
  
  console.log(a.search('marte'));  // true
  console.log(a.search('mano'));   // false
  
  console.log(a.startsWithPrefix('ma'));  // true
  
  a.delete('maria');
  console.log(a.search('maria'));  // false
  
  console.log(a.count);  // 3
  
  console.log(a.traverse());  // ['mar', 'marca', 'marte']