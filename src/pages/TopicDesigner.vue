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

root.value.addPart('second').addPart('under second').addPart('under second')
const third = root.value.addPart('third')
third.addPart('one')
third.addPart('two')
third.addPart('three')

const allNodes = root.value.getWithChildren()

const nodes = ref<TopologyNode[]>(allNodes.nodes)
const edges = ref<Edge[]>(allNodes.edges)

function onInit() {
  layoutNodes()
}

function rebuildNodes() {
  const allNodes = root.value.getWithChildren()

  nodes.value = allNodes.nodes

  nextTick(() => {
    edges.value = allNodes.edges
    layout(nodes.value, edges.value)
  })

  setTimeout(() => {
    fitView()
  }, 0)
}

function layoutNodes() {
  layout(nodes.value, edges.value)
  setTimeout(() => {
    fitView()
  }, 0)
}

function addNew(id: string) {
  nodes.value.find((n) => n.id === id)?.addPart('')

  rebuildNodes()
}

function remove(id: string) {
  const partToRemove = nodes.value.find((n) => n.id === id)
  if (!!partToRemove) {
    partToRemove.data.parent?.removePart(partToRemove)

    rebuildNodes()
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
      @init="onInit"
    >
      <template #node-part="props">
        <PartNode
          :node="props"
          @addNew="addNew"
          @nameChanged="layoutNodes"
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
