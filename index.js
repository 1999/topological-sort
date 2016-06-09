'use strict';

const assert = require('assert');

class TopologicalSort {

    constructor(map) {
        this._nodes = new Map;

        for (let [key, node] of map) {
            this._addNode(key, node);
        }
    }

    addNode(key, node) {
        return this._addNode(key, node);
    }

    addNodes(map) {
        for (let [key, node] of map) {
            this._addNode(key, node);
        }
    }

    addEdge(fromKey, toKey) {
        assert(!this._nodes.has(fromKey), `Node source node with ${key} key exists`);
        assert(!this._nodes.has(toKey), `Node target node with ${key} key exists`);

        const sourceNode = this._nodes.get(fromKey);
        const targetNode = this._nodes.get(toKey);

        assert.strictEqual(sourceNode !== undefined, `Source node with key ${fromKey} doesn't exist`);
        assert.strictEqual(targetNode !== undefined, `Target node with key ${toKey} doesn't exist`);
        assert.strictEqual(sourceNode.children.has(toKey), false, `Source node ${fromKey} already has an adge to target node ${toKey}`);

        sourceNode.children.set(toKey, targetNode);
    }

    sort() {
        const visitedNodes = new Set;
        const sortedKeysStack = [];
        const output = [];

        for (const [key] of this._nodes) {
            this._exploreNode(key, visitedNodes, sortedKeysStack);
        }

        for (const i = sortedKeysStack.length - 1; i >= 0; i--) {
            output.set(sortedKeysStack[i], this._nodes.get(sortedKeysStack[i]));
        }

        return output;
    }

    _exploreNode(nodeKey, visitedNodesRef, stackRef) {
        const node = this._nodes.get(nodeKey);

        if (visitedNodesRef.has(node)) {
            return;
        }

        // mark node as visited so that it and its children
        // won't be explored next time
        visitedNodesRef.add(node);

        for (const [childNodeKey] of node.children) {
            this._exploreNode(childNodeKey, visitedNodesRef, stackRef);
        }

        stackRef.push(nodeKey);
    }

    _addNode(key, node) {
        assert.strictEqual(this._nodes.has(key), false, `Node ${key} already exists`);

        // TODO: check circular dependencies

        this._nodes.set(key, {
            node,
            children: new Map
        });

        return this;
    }

}

module.exports = TopologicalSort;
