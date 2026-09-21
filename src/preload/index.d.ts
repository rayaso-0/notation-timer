import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveSolve: (totalTime: number) => Promise<number>
    }
  }
}