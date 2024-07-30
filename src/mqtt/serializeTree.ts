import { TopologyNode, useTopology } from '@/mqtt/topics'

interface SerializedNode {
  i: string
  n: string
  p: string
}

export function serializeTree(root: TopologyNode): string {
  const nodes = root.getWithChildren().nodes
  const nodeDatas = nodes.map((n) => {
    return {
      i: n.id,
      n: n.data.part.name,
      p: n.data.parent?.id,
    }
  })

  return JSON.stringify(nodeDatas)
}

export function deserializeTree(str: string): TopologyNode {
  const json = JSON.parse(str) as SerializedNode[]

  let unprocessed: SerializedNode[] = [...json]

  const sRoot = unprocessed.find((u) => !u.p)

  const { createRoot } = useTopology()

  const root = createRoot(sRoot!.n)
  root.id = sRoot?.i!
  unprocessed.splice(
    unprocessed.findIndex((n) => n.i === root.id),
    1
  )

  while (unprocessed.length != 0) {
    for (const node of unprocessed) {
      const parent = root.find(node.p)
      if (parent) {
        const newNode = parent.addPart(node.n)
        newNode.id = node.i
        unprocessed.splice(
          unprocessed.findIndex((n) => n.i === node.i),
          1
        )
      }
    }
  }

  return root
}
