import * as assert from 'assert';
import { TopologicalSort } from '../src';

/**
 * Validation routine for edges
 *
 * @param {TopologicalSort} sortOp
 * @param {Array<Object{from, to}>} edges
 */
function checkEdgesValid(sortOp, edges) {
    edges.forEach((edge) => sortOp.addEdge(edge.from, edge.to));

    const res = sortOp.sort();
    const sortedKeys = [...res.keys()];

    edges.forEach((edge) => {
        assert(
            sortedKeys.indexOf(edge.from) < sortedKeys.indexOf(edge.to),
            `Node ${edge.from} should be placed before ${edge.to} in sorted output`,
        );
    });
}

describe('topological-sort', () => {
    it('should throw if addNode() is invoked with already existing node', () => {
        const nodes = new Map<number, any>();
        const sortOp = new TopologicalSort<number, any>(nodes);

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

    it('should not change order of input nodes if no edges exist', () => {
        const nodes = new Map([['A', 1], ['B', 2], ['C', 3]]);
        const sortOp = new TopologicalSort(nodes);
        const res = sortOp.sort();
        const sortedKeys = [...res.keys()];

        assert.strictEqual(sortedKeys[0], 'A');
        assert.strictEqual(sortedKeys[1], 'B');
        assert.strictEqual(sortedKeys[2], 'C');
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
            ['H', 8],
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
            {from: 'F', to: 'G'},
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
            {from: 'variables', to: 'mixins'},
            {from: 'variables', to: 'block'},
            {from: 'mixins', to: 'block'},
            {from: 'block', to: 'block_mod_val'},
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
            ['user-avatar', 'file://...'],
        ]));

        const edges = [
            {from: 'variables', to: 'mixins'},
            {from: 'variables', to: 'argument'},
            {from: 'mixins', to: 'argument'},
            {from: 'argument', to: 'user'},
            {from: 'user-avatar', to: 'user'},
            {from: 'variables', to: 'user-avatar'},
            {from: 'mixins', to: 'user-avatar'},
            {from: 'variables', to: 'user'},
            {from: 'mixins', to: 'user'},
        ];

        checkEdgesValid(sortOp, edges);
    });

    it('should sort nodes in the same order', () => {
        const nodes = new Map([
            ['variables', 'file://...'],
            ['mixins', 'file://...'],
            ['argument', 'file://...'],
            ['mixins', 'file://...'],
            ['user', 'file://...'],
            ['user-avatar', 'file://...'],
        ]);
        const sortOp = new TopologicalSort(nodes);

        const edges = [
            {from: 'variables', to: 'mixins'},
            {from: 'variables', to: 'argument'},
            {from: 'mixins', to: 'argument'},
            {from: 'argument', to: 'user'},
            {from: 'user-avatar', to: 'user'},
            {from: 'variables', to: 'user-avatar'},
            {from: 'mixins', to: 'user-avatar'},
            {from: 'variables', to: 'user'},
            {from: 'mixins', to: 'user'},
        ];

        edges.forEach(({from, to}) => sortOp.addEdge(from, to));

        const res = sortOp.sort();
        const sortedKeys = [...res.keys()];

        sortOp.sort();
        const sortedKeys2 = [...res.keys()];

        sortedKeys.forEach((_, index) => {
            assert.strictEqual(
                sortedKeys[index],
                sortedKeys2[index],
                `Sorted nodes differ at index ${index}`,
            );
        });
    });

    it('should throw if node edges form circular dependency', () => {
        const nodes = new Map([
            ['variables', 'file://...'],
            ['mixins', 'file://...'],
            ['argument', 'file://...'],
            ['mixins', 'file://...'],
            ['user', 'file://...'],
            ['user-avatar', 'file://...'],
        ]);
        const sortOp = new TopologicalSort(nodes);

        const edges = [
            {from: 'mixins', to: 'variables'},
            {from: 'variables', to: 'argument'},
            {from: 'mixins', to: 'argument'},
            {from: 'argument', to: 'user'},
            {from: 'user-avatar', to: 'user'},
            {from: 'variables', to: 'user-avatar'},
            {from: 'mixins', to: 'user-avatar'},
            {from: 'variables', to: 'user'},
            {from: 'user', to: 'mixins'},
        ];

        edges.forEach(({from, to}) => sortOp.addEdge(from, to));

        assert.throws(() => {
            sortOp.sort();
        }, 'sort() should throw if there are circular dependencies');
    });

    it('should throw if node edges form circular dependency starting from index 1', () => {
        const nodes = new Map([
            ['A', 'file://...'],
            ['B', 'file://...'],
            ['C', 'file://...'],
            ['D', 'file://...'],
        ]);
        const sortOp = new TopologicalSort(nodes);

        const edges = [
            {from: 'A', to: 'B'},
            {from: 'B', to: 'C'},
            {from: 'C', to: 'D'},
            {from: 'D', to: 'B'},
        ];

        edges.forEach(({from, to}) => sortOp.addEdge(from, to));

        assert.throws(() => {
            sortOp.sort();
        }, 'sort() should throw if there are circular dependencies');
    });

    it('shouldn\'t throw for missing circular dependency', () => {
        const nodes = new Map([
            ['B', 'file://...'],
            ['A', 'file://...'],
        ]);
        const sortOp = new TopologicalSort(nodes);
        sortOp.addEdge('A', 'B');

        assert.doesNotThrow(() => {
            sortOp.sort();
        }, 'sort() should not throw if node without dependencies is standing at index 0');
    });

    it('shouldn\'t loose content associated with map keys after sort', () => {
        const nodes = new Map([
            ['A', 'some A contents'],
            ['B', 'some B contents'],
        ]);
        const sortOp = new TopologicalSort(nodes);
        sortOp.addEdge('A', 'B');

        const sorted = sortOp.sort();
        assert.strictEqual(sorted.get('A')!.node, 'some A contents');
        assert.strictEqual(sorted.get('B')!.node, 'some B contents');
    });
});
