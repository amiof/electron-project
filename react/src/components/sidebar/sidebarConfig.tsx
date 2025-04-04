import { TreeViewBaseItem } from "@mui/x-tree-view/models"
import { FileType } from "@components/sidebar/utils.ts"

export type ExtendedTreeItemProps = {
  fileType?: FileType;
  id: string;
  label: string;
  parent: string
};

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: "1",
    label: "All Downloads",
    children: [
      { id: "1.1", label: "all", fileType: "all", parent: "AllDownloads" },
      { id: "1.2", label: "Compressed", fileType: "zip", parent: "AllDownloads" },
      { id: "1.6", label: "Musics", fileType: "music", parent: "AllDownloads" },
      { id: "1.3", label: "Videos", fileType: "video", parent: "AllDownloads" },
      { id: "1.4", label: "Documents", fileType: "pdf", parent: "AllDownloads" },
      { id: "1.5", label: "Images", fileType: "image", parent: "AllDownloads" },
      { id: "1.7", label: "Other", fileType: "folder", parent: "AllDownloads" }
    ],
    parent: "none"
  },
  {
    id: "2",
    label: "UnFinished",
    fileType: "unfinished",
    // children: [
    //   { id: "2.2", label: "Compressed", fileType: "doc", parent: "UnFinished" },
    //   { id: "2.3", label: "Musics", fileType: "doc", parent: "UnFinished" },
    //   { id: "2.4", label: "Videos", fileType: "doc", parent: "UnFinished" },
    //   { id: "2.5", label: "Documents", fileType: "pdf", parent: "UnFinished" },
    //   { id: "2.6", label: "Images", fileType: "video", parent: "UnFinished" },
    //   { id: "2.7", label: "Other", fileType: "video", parent: "AllDownloads" }
    // ],
    parent: "none"
  },
  { id: "3", label: "Finished", fileType: "finish", parent: "none" },
  { id: "4", label: "Trash", fileType: "trash", parent: "none" }
]


export default ITEMS