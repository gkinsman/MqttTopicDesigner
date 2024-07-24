<script lang="ts" setup>
import {
  Handle,
  type NodeProps,
  Position,
  useHandleConnections,
} from '@vue-flow/core'
import { computed, onMounted, ref, toRef } from 'vue'
import type { TopologyNodeData } from '@/mqtt/topics'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import AddIcon from '@/components/AddIcon.vue'
import RemoveIcon from '@/components/RemoveIcon.vue'
import VariableIcon from '@/components/VariableIcon.vue'

const props = defineProps<{
  node: NodeProps<TopologyNodeData>
}>()

const emit = defineEmits<{
  (e: 'nameChanged'): void
  (e: 'remove', nodeId: string): void
  (e: 'addNew', nodeId: string): void
}>()

const sourceConnections = useHandleConnections({
  type: 'target',
})

const targetConnections = useHandleConnections({
  type: 'source',
})

onMounted(() => {
  console.log(`focusing on input`)
})

const nameInput = ref<HTMLInputElement | null>(null)

function nameChanged() {
  emit('nameChanged')
}

function remove() {
  emit('remove', props.node.id)
}

function addNew() {
  emit('addNew', props.node.id)
}

const hoveringOverPart = ref(false)
const hoveringOverToolbar = ref(false)
const toolbarActive = computed(() => {
  return hoveringOverPart.value || hoveringOverToolbar.value
})

const isSender = toRef(() => sourceConnections.value.length >= 0)
const isReceiver = toRef(() => targetConnections.value.length >= 0)
</script>

<template>
  <div class="flex w-auto">
    <div>
      <div
        class="flex"
        @mouseenter="hoveringOverPart = true"
        @mouseleave="hoveringOverPart = false"
      >
        <input
          ref="nameInput"
          v-model="props.node.data.part.name"
          v-autowidth
          v-focus
          class="px-2 border-2 rounded-md nodrag bg-red text-white outline-white"
          type="text"
          @input="nameChanged"
        />
      </div>

      <NodeToolbar
        :is-visible="toolbarActive"
        :offset="0"
        :position="Position.Top"
      >
        <div
          class="flex w-30 py-2 pb-4 -mb-1"
          @mouseenter="hoveringOverToolbar = true"
          @mouseleave="hoveringOverToolbar = false"
        >
          <VariableIcon class="cursor-pointer" color="#eaa03d"></VariableIcon>
          <AddIcon class="cursor-pointer" color="#4EAA6E" @click="addNew" />
          <RemoveIcon class="cursor-pointer" color="#cb320c" @click="remove" />
        </div>
      </NodeToolbar>
    </div>

    <div
      :style="{ backgroundColor: '0 0 10px rgba(0, 0, 0, 0.5)' }"
      class="root-node"
    >
      <Handle
        v-if="isSender"
        :position="Position.Right"
        class="invisible"
        type="source"
      ></Handle>
      <Handle
        v-if="isReceiver"
        :position="Position.Left"
        class="invisible"
        type="target"
      ></Handle>
    </div>
  </div>
</template>

<style scoped></style>
