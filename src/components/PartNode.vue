﻿<script lang="ts" setup>
import {Handle, type NodeProps, Position, useHandleConnections,} from '@vue-flow/core'
import {computed, ref, toRef} from 'vue'
import type {TopologyNodeData} from '@/mqtt/topics'
import {NodeToolbar} from '@vue-flow/node-toolbar'
import AddIcon from '@/components/AddIcon.vue'
import RemoveIcon from '@/components/RemoveIcon.vue'
import VariableIcon from '@/components/VariableIcon.vue'
import {vFocus} from '@/directives/FocusDirective'
import {useOptions} from '@/composables/useOptions'

const {options} = useOptions()

const props = defineProps<{
  node: NodeProps<TopologyNodeData>
}>()

const emit = defineEmits<{
  (e: 'nodeChanged', rebuild: boolean): void
  (e: 'remove', nodeId: string): void
  (e: 'addNew', nodeId: string): void
}>()

const sourceConnections = useHandleConnections({
  type: 'target',
})

const targetConnections = useHandleConnections({
  type: 'source',
})

const nameInput = ref<HTMLInputElement | null>(null)

function nodeChanged() {
  emit('nodeChanged', true)
}

function remove() {
  emit('remove', props.node.id)
}

function addNew() {
  emit('addNew', props.node.id)
}

function toggleIsVariable() {
  props.node.data.part.isPlaceholder = !props.node.data.part.isPlaceholder
  emit('nodeChanged', false)
}

function replaceSpaceWith(e: KeyboardEvent) {
  if (!!options.replaceSpacesWith && e.code === 'Space') {
    props.node.data.part.name = props.node.data.part.name.replace(
        / /g,
        options.replaceSpacesWith.toString(),
    )
    console.log(`Replacing space with ${options.replaceSpacesWith}`)
  }
}

const hoveringOverPart = ref(false)
const hoveringOverToolbar = ref(false)
const toolbarActive = computed(() => {
  return hoveringOverPart.value || hoveringOverToolbar.value
})

const isSender = toRef(() => sourceConnections.value.length >= 0)
const isReceiver = toRef(() => targetConnections.value.length >= 0)
const isRoot = toRef(() => !isReceiver)
</script>

<template>
  <div class="flex w-auto">
    <div>
      <div
          class="flex"
          @mouseenter="hoveringOverPart = true"
          @mouseleave="hoveringOverPart = false"
      >
        <span
            v-show="props.node.data.part.isPlaceholder"
            class="text-[#eaa03d] absolute left-1"
        >{</span
        >

        <input
            ref="nameInput"
            v-model="props.node.data.part.name"
            v-autowidth
            v-focus
            class="px-2 border-2 rounded-md nodrag bg-red text-white outline-white"
            type="text"
            @input="nodeChanged"
            @keyup="replaceSpaceWith"
        />
        <span
            v-show="props.node.data.part.isPlaceholder"
            class="text-[#eaa03d] absolute right-1"
        >}</span
        >
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
          <VariableIcon
              :active="props.node.data.part.isPlaceholder"
              class="cursor-pointer"
              color="#eaa03d"
              @click="toggleIsVariable"
          ></VariableIcon>
          <AddIcon class="cursor-pointer" color="#4EAA6E" @click="addNew"/>
          <RemoveIcon
              v-if="!isRoot"
              class="cursor-pointer"
              color="#cb320c"
              @click="remove"
          />
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
