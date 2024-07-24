import { type Edge, type Node } from '@vue-flow/core'

type TopologyRoot = TopologyNode

type NodesAndEdges = { nodes: TopologyNode[]; edges: Edge[] }

let idCounter = 0

class TopicPart {
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

export class TopologyNode implements Node {
  public children: TopologyNode[] = []
  public id: string = (idCounter++).toString()
  public position = { x: 0, y: 0 }
  public type: string = 'part'
  public draggable = false

  constructor(public data: TopologyNodeData) {}

  public addPart(part: string) {
    const topicPart = TopicPart.fromString(part)
    const newNode = new TopologyNode({ part: topicPart, parent: this })
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
    ]

    return {
      nodes: allNodes,
      edges: allEdges,
    }
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

export function useTopology() {
  function createRoot(name: string): TopologyRoot {
    const topicPart = TopicPart.fromString(name)

    return new TopologyNode({ part: topicPart, parent: null })
  }

  return { createRoot }
}
