import { StoreApi } from 'zustand';
import { TDownloaderStore } from './storeType';

export type SetState = StoreApi<TDownloaderStore>['setState'];
export type GetState = StoreApi<TDownloaderStore>['getState'];

export const downloaderAction = (set: SetState, get: GetState) => ({
  getFiles: (file: string) => {
    const currentFiles = get().files;
    if (currentFiles && !currentFiles.includes(file)) {
      set({ files: [...currentFiles, file] });
    }
  },
  // removeFile: (file: string) => {
  //   set((state) => ({ files: state.files.filter(f => f !== file) }));
  // },
  // clearFiles: () => {
  //   set({ files: [] });
  // },
});
