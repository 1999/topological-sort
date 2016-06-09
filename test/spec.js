'use strict';

const assert = require('assert');
const mocha = require('mocha');
const TopologicalSort = require('../');

/**
 * Validation routine for edges
 *
 * @param {TopologicalSort} sortOp
 * @param {Array<Object{from, to}>} edges
 */
function checkEdgesValid(sortOp, edges) {
    edges.forEach(edge => sortOp.addEdge(edge.from, edge.to));

    const res = sortOp.sort();
    const sortedKeys = [...res.keys()];

    edges.forEach(edge => {
        assert(
            sortedKeys.indexOf(edge.from) < sortedKeys.indexOf(edge.to),
            `Node ${edge.from} should be placed before ${edge.to} in sorted output`
        );
    });
}

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
        const nodes = new Map([
            ['A', 1],
            ['B', 2],
            ['C', 3],
            ['D', 4],
            ['E', 5],
            ['F', 6],
            ['G', 7],
            ['H', 8]
        ]);
        const sortOp = new TopologicalSort(nodes);
        const edges = [
            {from: 'A', to: 'C'},
            {from: 'B', to: 'C'},
            {from: 'B', to: 'D'},
            {from: 'C', to: 'E'},
            {from: 'D', to: 'F'},
            {from: 'E', to: 'F'},
            {from: 'E', to: 'H'},
            {from: 'F', to: 'G'}
        ];

        checkEdgesValid(sortOp, edges);
    });

    it('should sort nodes passed in constructor + addNode()', () => {
        const nodes = new Map([['variables', 'file://...']]);
        const sortOp = new TopologicalSort(nodes);

        sortOp.addNode('mixins', 'file://...');
        sortOp.addNode('block', 'file://...');
        sortOp.addNode('block_mod_val', 'file://...');

        const edges = [
            {from: 'mixins', to: 'variables'},
            {from: 'block', to: 'variables'},
            {from: 'block', to: 'mixins'},
            {from: 'block_mod_val', to: 'block'}
        ];

        checkEdgesValid(sortOp, edges);
    });

    it('should sort nodes passed in constructor + addNodes()', () => {
        const nodes = new Map([['variables', 'file://...']]);
        const sortOp = new TopologicalSort(nodes);

        sortOp.addNodes(new Map([
            ['mixins', 'file://...'],
            ['argument', 'file://...'],
            ['mixins', 'file://...'],
            ['user', 'file://...'],
            ['user-avatar', 'file://...']
        ]));

        const edges = [
            {from: 'mixins', to: 'variables'},
            {from: 'argument', to: 'variables'},
            {from: 'argument', to: 'mixins'},
            {from: 'argument', to: 'user'},
            {from: 'user', to: 'user-avatar'},
            {from: 'user-avatar', to: 'variables'},
            {from: 'user-avatar', to: 'mixins'},
            {from: 'user', to: 'variables'},
            {from: 'user', to: 'mixins'}
        ];

        checkEdgesValid(sortOp, edges);
    });
});
