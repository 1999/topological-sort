'use strict';

const assert = require('assert');
const mocha = require('mocha');
const TopologicalSort = require('../');

describe('topological-sort', () => {
    it('should use expected API functions', () => {
        assert.strictEqual(typeof TopologicalSort, 'function', 'Main exported object should be a function');

        const sortOp = new TopologicalSort(new Map);
        assert.strictEqual(typeof sortOp.addNode, 'function', 'TopologicalSort instance should has "addNode" method');
        assert.strictEqual(typeof sortOp.addNodes, 'function', 'TopologicalSort instance should has "addNodes" method');
        assert.strictEqual(typeof sortOp.sort, 'function', 'TopologicalSort instance should has "sort" method');
        assert.strictEqual(typeof sortOp.addEdge, 'function', 'TopologicalSort instance should has "addEdge" method');
    });

    it('should throw if addNode() is invoked with already existing node', () => {
        const sortOp = new TopologicalSort(new Map);

        assert.doesNotThrow(() => {
            sortOp.addNode(1, {});
        }, 'addNode() should not throw if nodes list is empty');

        assert.throws(() => {
            sortOp.addNode(1, {});
        }, 'addNode() should throw an error if node with this key already exists');
    });

    it('should throw if addEdge() is invoked with wrong params', () => {
        const nodes = new Map([['A', 1], ['B', 2]]);
        const sortOp = new TopologicalSort(nodes);

        assert.doesNotThrow(() => {
            sortOp.addEdge('A', 'B');
        }, 'addEdge() should not throw for valid params');

        assert.throws(() => {
            sortOp.addEdge('A', 'C');
        }, 'addNode() should throw an error if any of the params are not valid node keys');

        assert.throws(() => {
            sortOp.addEdge('C', 'D');
        }, 'addNode() should throw an error if any of the params are not valid node keys');

        assert.throws(() => {
            sortOp.addEdge('A', 'C');
        }, 'addNode() should throw an error if edge already exists');
    });

    it('should throw if addNodes() is invoked with already existing node', () => {
        const nodes = new Map([['A', 1], ['B', 2]]);
        const sortOp = new TopologicalSort(nodes);

        assert.throws(() => {
            const newNodes = new Map([['B', 3]]);
            sortOp.addNodes(newNodes);
        }, 'addNodes() should throw an error if nodes already exists');
    });

    it('should return map after sort()', () => {
        const nodes = new Map([['A', 1], ['B', 2], ['C', 3]]);
        const sortOp = new TopologicalSort(nodes);
        const res = sortOp.sort();

        assert.strictEqual(res instanceof Map, true, 'TopologicalSort sort() result variable should be a Map instance');
        assert.strictEqual(res.size, 3);
    });

    it('should sort nodes passed in constructor only + addEdge()', () => {
        throw new Error('NOT_IMPLEMENTED');
    });

    it('should sort nodes passed in constructor + addNode()', () => {
        throw new Error('NOT_IMPLEMENTED');
    });

    it('should sort nodes passed in constructor + addNodes()', () => {
        throw new Error('NOT_IMPLEMENTED');
    });
});
