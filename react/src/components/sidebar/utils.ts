import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import ArticleIcon from "@mui/icons-material/Article"
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack"
import FolderRounded from "@mui/icons-material/FolderRounded"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import DeleteIcon from "@mui/icons-material/Delete"
import FolderZipIcon from "@mui/icons-material/FolderZip"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import AppsIcon from "@mui/icons-material/Apps"
import RemoveDoneIcon from "@mui/icons-material/RemoveDone"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export type FileType =
  "image"
  | "pdf"
  | "doc"
  | "video"
  | "folder"
  | "pinned"
  | "trash"
  | "music"
  | "zip"
  | "all"
  | "unfinished"
  | "finish"

export const getIconFromFileType = (fileType: FileType) => {
  switch (fileType) {
    case "image":
      return ImageIcon
    case "pdf":
      return PictureAsPdfIcon
    case "doc":
      return ArticleIcon
    case "video":
      return VideoCameraBackIcon
    case "folder":
      return FolderRounded
    case "pinned":
      return FolderOpenIcon
    case "trash":
      return DeleteIcon
    case "music":
      return MusicNoteIcon
    case "zip":
      return FolderZipIcon
    case "all":
      return AppsIcon
    case "unfinished":
      return RemoveDoneIcon
    case "finish":
      return CheckCircleIcon
    default:
      return ArticleIcon
  }
}