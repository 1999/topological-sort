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

    it('should sort nodes passed in constructor only', () => {

    });

    it('should throw if addNode() is invoked with already existing node', () => {

    });

    it('should throw if addEdge() is invoked with wrong params', () => {

    });

    it('should sort nodes passed in constructor + addNode()', () => {

    });

    it('should throw if addNodes() is invoked with already existing node', () => {

    });

    it('should sort nodes passed in constructor + addNodes()', () => {

    });
});
