import { reactive } from 'vue'

export interface MqttDesignerOptions {
  replaceSpacesWith: boolean | string
}

const options: MqttDesignerOptions = reactive({
  replaceSpacesWith: '-',
})

export const useOptions = function () {
  return {
    options,
  }
}
