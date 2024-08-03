import { expect, test } from 'vitest'
import { useTopology } from '@/mqtt/topics'
import { deserializeTree, serializeTree } from '@/mqtt/serializeTree'

test('Can create topology with single named node', () => {
  const { createRoot } = useTopology()
  const topology = createRoot('first')

  expect(topology.data.part.name).toBe('first')
  expect(topology.id).toBe('1')
})

test('Can create topology with two nodes', () => {
  const { createRoot } = useTopology()
  const root = createRoot('first')
  root.addPart('second')

  expect(root.children.length).toBe(1)
  expect(root.children[0].data.part.name).toBe('second')
})

test('Can create topology with placeholder node', () => {
  const { createRoot } = useTopology()
  const root = createRoot('first')
  root.addPart('{id}')

  expect(root.children[0].data.part.isPlaceholder).toBe(true)
})

test('Can build array of nodes from tree', () => {
  const { createRoot } = useTopology()
  const root = createRoot('first')
  root.addPart('second').addPart('third')

  const flattened = root.getWithChildren()

  expect(flattened.nodes.length).toBe(3)
  expect(flattened.nodes[0].data.part.name).toBe('first')
  expect(flattened.nodes[1].data.part.name).toBe('second')
  expect(flattened.nodes[2].data.part.name).toBe('third')
})

test('Can build array of edges from tree', () => {
  const { createRoot } = useTopology()

  const first = createRoot('first')
  first.addPart('second')
  first.addPart('third')

  const flattened = first.getWithChildren()

  expect(flattened.edges.length).toBe(2)
  expect(
    flattened.edges.some((x) => x.target == 'second' && x.source == 'first')
  )
  expect(
    flattened.edges.some((x) => x.target == 'third' && x.source == 'first')
  )
})

test('Can remove nodes from tree', () => {
  const { createRoot } = useTopology()
  const root = createRoot('first')

  const second = root.addPart('second')
  second.addPart('third')

  root.removePart(second)

  const flattened = root.getWithChildren()

  expect(flattened.nodes.length).toBe(1)
  expect(flattened.nodes[0].data.part.name).toBe('first')
})

test('Can serialize tree', () => {
  const { createRoot } = useTopology()
  const root = createRoot('first')

  const second = root.addPart('second')
  second.data.part.isPlaceholder = true
  second.addPart('third')

  const serialized = serializeTree(root)

  expect(serialized).toBe(
    '[{"i":"1","n":"first"},{"i":"2","n":"second","p":"1","v":1},{"i":"3","n":"third","p":"2"}]'
  )
})
test('Can find node', () => {
  const { createRoot } = useTopology()
  const root = createRoot('first')

  const second = root.addPart('second')
  const third = second.addPart('third')

  const found = root.find(third.id)
  expect(found?.id).toBe(third.id)
})

test('Can deserialize tree', () => {
  const { createRoot } = useTopology()

  const root = createRoot('first')

  const second = root.addPart('second')
  second.data.part.isPlaceholder = true
  const third = second.addPart('third')

  const serialized = serializeTree(root)
  const deserializedRoot = deserializeTree(serialized)

  // Expect that ids are reconstructed correctly
  expect(deserializedRoot.data.part.name).toBe('first')

  const desSecond = deserializedRoot.find('2')
  expect(desSecond?.data.part.name).toBe('second')
  expect(desSecond?.data.part.isPlaceholder).toBe(true)

  expect(deserializedRoot.find('3')?.data.part.name).toBe('third')
})
