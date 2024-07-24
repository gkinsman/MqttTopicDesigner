import type { App } from 'vue'

export interface FocusOnMountPlugin {
  install: (app: App) => void
}

/*
export const useFocusOnMount: FocusOnMountPlugin =  {
    install: (app) => {
        app.directive('mount-focus', {
            onMounted()
        })
    }
}*/
