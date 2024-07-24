<script lang="ts" setup>
import { type Edge, useVueFlow, VueFlow } from '@vue-flow/core'
import { nextTick, ref } from 'vue'
import { useLayout } from '@/composables/useLayout'
import { TopologyNode, useTopology } from '@/mqtt/topics'
import PartNode from '@/components/PartNode.vue'
//import PartNode from 'components/PartNode.vue'

const { createRoot } = useTopology()
const { layout } = useLayout()
const { fitView } = useVueFlow()

const root = ref<TopologyNode>(createRoot('root'))

const nodes = ref<TopologyNode[]>([])
const edges = ref<Edge[]>([])

function rebuildNodes() {
  edges.value = []
  nodes.value = []
  const allNodes = root.value.getWithChildren()

  nodes.value = allNodes.nodes

  nextTick(() => {
    edges.value = allNodes.edges
    layoutGraph()
    setTimeout(() => fitView(), 10)
  })
}

function initialLayout() {
  root.value.addPart('second').addPart('under second').addPart('under second')
  const third = root.value.addPart('third')
  third.addPart('one')
  third.addPart('two')
  third.addPart('three')

  rebuildNodes()

  setTimeout(() => fitView(), 10)
}

function layoutGraph() {
  layout(nodes.value, edges.value)
}

function addNew(id: string) {
  nodes.value.find((n) => n.id === id)?.addPart('new')

  rebuildNodes()
}

function remove(id: string) {
  const partToRemove = nodes.value.find((n) => n.id === id)
  if (!!partToRemove) {
    partToRemove.data!.parent.removePart(partToRemove)

    rebuildNodes()
    nextTick(() => fitView())
  }
}
</script>

<template>
  <main class="bg-white">
    <VueFlow
      :edges="edges"
      :max-zoom="4"
      :min-zoom="0.4"
      :nodes="nodes"
      :nodesDraggable="true"
      @init="initialLayout"
    >
      <template #node-part="props">
        <PartNode
          :node="props"
          @addNew="addNew"
          @nameChanged="layoutGraph"
          @remove="remove"
        />
      </template>
    </VueFlow>
  </main>
</template>

<style scoped>
main {
  height: 95vh;
}
</style>
