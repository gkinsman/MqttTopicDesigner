import { type Edge, type Node, Position, useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import dagre from '@dagrejs/dagre'

export function useLayout() {
  const { findNode } = useVueFlow()

  const graph = ref(new dagre.graphlib.Graph())

  function layout(nodes: Node[], edges: Edge[]) {
    // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
    const dagreGraph = new dagre.graphlib.Graph()

    graph.value = dagreGraph

    dagreGraph.setDefaultEdgeLabel(() => ({}))

    dagreGraph.setGraph({ rankdir: 'LR' })

    for (const node of nodes) {
      // if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
      const graphNode = findNode(node.id)

      dagreGraph.setNode(node.id, {
        width: graphNode?.dimensions.width || 150,
        height: graphNode?.dimensions.height || 50,
      })
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target)
    }

    dagre.layout(dagreGraph)

    for (const node of nodes) {
      const nodeWithPosition = dagreGraph.node(node.id)
      node.targetPosition = Position.Left
      node.sourcePosition = Position.Right
      node.position.x = nodeWithPosition.x
      node.position.y = nodeWithPosition.y
    }
  }

  return { graph, layout }
}
