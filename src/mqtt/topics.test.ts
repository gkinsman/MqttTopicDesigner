import { expect, test } from 'vitest'
import { useTopology } from '@/mqtt/topics'

test('Can create topology with single named node', () => {
  const { createRoot } = useTopology()
  const topology = createRoot('first')

  expect(topology.data.part.name).toBe('first')
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
  const third = second.addPart('third')

  root.removePart(second)

  const flattened = root.getWithChildren()

  expect(flattened.nodes.length).toBe(1)
  expect(flattened.nodes[0].data.part.name).toBe('first')
})
