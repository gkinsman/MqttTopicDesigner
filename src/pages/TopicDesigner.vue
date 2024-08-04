<script lang="ts" setup>
import { type Edge, useVueFlow, VueFlow } from '@vue-flow/core'
import { nextTick, onMounted, ref } from 'vue'
import { useLayout } from '@/composables/useLayout'
import { TopologyNode, useTopology } from '@/mqtt/topics'
import PartNode from '@/components/PartNode.vue'
import { deserializeTree, serializeTree } from '@/mqtt/serializeTree'
import { useRouteQuery } from '@vueuse/router'
import { useRouter } from 'vue-router'

const { createRoot } = useTopology()
const { layout } = useLayout()
const { fitView } = useVueFlow()
const router = useRouter()

const tree = useRouteQuery('tree')

const root = ref<TopologyNode>(createRoot('root'))

const nodes = ref<TopologyNode[]>([])
const edges = ref<Edge[]>([])

onMounted(() => {
  if (tree.value) {
    setFromUrl()
  } else {
    root.value
      .addPart('second')
      .addPart('under second')
      .addPart('further under second')
    const third = root.value.addPart('third')
    third.addPart('one')
    third.addPart('two')
    third.addPart('three')
  }
  rebuildNodes(true)
})

function onInit() {
  layoutNodes(true)
}

function setFromUrl() {
  const json = atob(tree.value as string)
  root.value = deserializeTree(json)
  rebuildNodes(true)
}

function rebuildNodes(fit: boolean) {
  const allNodes = root.value.getWithChildren()

  nodes.value = allNodes.nodes

  updateRouteHash()

  nextTick(() => {
    edges.value = allNodes.edges

    layout(nodes.value, edges.value)
  })

  if (fit) {
    setTimeout(() => {
      fitView()
    }, 0)
  }
}

function layoutNodes(fit: boolean) {
  layout(nodes.value, edges.value)

  if (fit) {
    setTimeout(() => {
      fitView()
    }, 0)
  }
}

function updateRouteHash() {
  const data = serializeTree(root.value)
  const hash = btoa(data)

  //tree.value = hash

  router.push({ query: { tree: hash } })
}

function addNew(id: string) {
  nodes.value.find((n) => n.id === id)?.addPart('')

  rebuildNodes(false)
}

function remove(id: string) {
  const partToRemove = nodes.value.find((n) => n.id === id) as TopologyNode
  if (!!partToRemove) {
    partToRemove.data.parent?.removePart(partToRemove)
  }

  rebuildNodes(false)
  nodeChanged(false)
}

function nodeChanged(rebuild: boolean) {
  if (rebuild) {
    layoutNodes(false)
  }
  updateRouteHash()
}
</script>

<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex justify-between h-16 bg-navy drop-shadow-md">
      <div class="text-xl self-center pl-5 text-white font-medium">
        MQTT Topic Designer
      </div>

      <div></div>
    </div>

    <div>
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
              @nodeChanged="nodeChanged"
              @remove="remove"
            />
          </template>
        </VueFlow>
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  height: 95vh;
}
</style>
