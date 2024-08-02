import { type Edge, type Node } from '@vue-flow/core'

type TopologyRoot = TopologyNode

type NodesAndEdges = { nodes: TopologyNode[]; edges: Edge[] }

export class TopicPart {
  private constructor(
    public name: string,
    public isPlaceholder: boolean
  ) {}

  static fromString(name: string) {
    const isPlaceholder = name.startsWith('{') && name.endsWith('}')

    name = isPlaceholder ? name.substring(0, name.length - 1) : name

    return new TopicPart(name, isPlaceholder)
  }
}

export interface TopologyNodeData {
  part: TopicPart
  parent: TopologyNode | null
}

interface IdProvider {
  nextId: () => number
}

export class TopologyNode implements Node {
  public children: TopologyNode[] = []
  public id: string
  public position = { x: 0, y: 0 }
  public type: string = 'part'
  public draggable = false

  constructor(
    public idProvider: IdProvider,
    public data: TopologyNodeData
  ) {
    this.id = idProvider.nextId().toString()
  }

  public addPart(part: string) {
    const topicPart = TopicPart.fromString(part)
    const newNode = new TopologyNode(this.idProvider, {
      part: topicPart,
      parent: this,
    })
    this.children.push(newNode)
    return newNode
  }

  getWithChildren(): NodesAndEdges {
    const childrenProbe = this.children.flatMap((c) => c.getWithChildren())

    const allChildNodes = childrenProbe.flatMap((c) => c.nodes)
    const thisEdges = this.children.map((c) => createEdge(this, c))

    const allNodes: TopologyNode[] = [this, ...allChildNodes]
    const allEdges: Edge[] = [
      ...thisEdges,
      ...childrenProbe.flatMap((c) => c.edges),
    ].sort((a, b) => (a.id > b.id ? 1 : -1))

    return {
      nodes: allNodes,
      edges: allEdges,
    }
  }

  find(id: string): TopologyNode | undefined {
    if (this.id == id) {
      return this
    }

    for (const child of this.children) {
      const found = child.find(id)
      if (found) {
        return found
      }
    }

    const child = this.children.find((c) => c.find(id))
    if (child) return child
  }

  removePart(partToRemove: TopologyNode): boolean {
    for (const child of this.children) {
      const foundChildIdx = this.children.findIndex(
        (node, idx) => node.id == child.id
      )
      if (child.id === partToRemove.id) {
        this.children.splice(foundChildIdx, 1)
        return true
      }
      if (child.removePart(partToRemove)) {
        return true
      }
    }
    return false
  }
}

function createEdge(from: TopologyNode, to: TopologyNode): Edge {
  return {
    id: `e${from.id}-${to.id}`,
    source: from.id.toString(),
    target: to.id.toString(),
    animated: true,
  }
}

function useIdProvider(): IdProvider {
  let id = 1

  function nextId() {
    return id++
  }

  return {
    nextId,
  }
}

export function useTopology() {
  function createRoot(name: string): TopologyRoot {
    const idProvider = useIdProvider()
    const topicPart = TopicPart.fromString(name)

    return new TopologyNode(idProvider, { part: topicPart, parent: null })
  }

  return { createRoot }
}
