# Topological sort

[![Greenkeeper badge](https://badges.greenkeeper.io/1999/topological-sort.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/1999/topological-sort.svg?style=flat)](https://travis-ci.org/1999/topological-sort)
[![DevDependency Status](http://img.shields.io/david/dev/1999/topological-sort.svg?style=flat)](https://david-dm.org/1999/topological-sort#info=devDependencies)

This package is distributed as Javascript, but you can also use it in your TypeScript project.

## API
### Javascript example

```javascript
const { TopologicalSort } = require('topological-sort');

// you can pass nodes as a map into constructor:
const nodes = new Map();
nodes.set('variables', variablesObj);
nodes.set('mixins', mixinsObj);
const sortOp = new TopologicalSort(nodes);

// ...or add them to existing object instance with addNode() or addNodes():
sortOp.addNode('block', blocksObj);
sortOp.addNodes(new Map([
    ['block_mod_val1', blockModObj1],
    ['block_mod_val2', blockModObj2]
]));

// then you should add adges between nodes
sortOp.addEdge('variables', 'mixins'); // from, to
sortOp.addEdge('mixins', 'block');
sortOp.addEdge('variables', 'block');
sortOp.addEdge('block', 'block_mod_val2');
sortOp.addEdge('block', 'block_mod_val1');

// sorting is simple: it returns a new map wih sorted elements
// if circular dependency is found, sort() operation throws an AssertionError
const sorted = sortOp.sort();
const sortedKeys = [...res.keys()]; // ['variables', 'mixins', 'block', 'block_mod_val1', 'block_mod_val2']
```

### Typescript example

```typescript
import TopologicalSort from 'topological-sort';

// TopologicalSort class instances have a map inside.
// This map stores the references between your nodes (edges)
// "NodesKeyType" is the type for your tree node identifiers
// "NodesValueType" is the type for your tree nodes
const nodes = new Map<NodesKeyType, NodesValueType>();
nodes.set('variables', variablesObj);
nodes.set('mixins', mixinsObj);
const sortOp = new TopologicalSort<NodesKeyType, NodesValueType>(nodes);

sortOp.addEdge('variables', 'mixins');
const sorted = sortOp.sort();
const sortedKeys = [...res.keys()]; // ['variables', 'mixins']
```

## More info:

 * https://en.wikipedia.org/wiki/Topological_sorting
 * https://www.cs.usfca.edu/~galles/visualization/TopoSortDFS.html
 * http://www.geeksforgeeks.org/topological-sorting/
 * https://www.youtube.com/watch?v=ddTC4Zovtbc
