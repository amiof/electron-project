import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import FolderRounded from "@mui/icons-material/FolderRounded";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteIcon from "@mui/icons-material/Delete";

export type FileType = 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash';

export const getIconFromFileType = (fileType: FileType) => {
    switch (fileType) {
        case 'image':
            return ImageIcon;
        case 'pdf':
            return PictureAsPdfIcon;
        case 'doc':
            return ArticleIcon;
        case 'video':
            return VideoCameraBackIcon;
        case 'folder':
            return FolderRounded;
        case 'pinned':
            return FolderOpenIcon;
        case 'trash':
            return DeleteIcon;
        default:
            return ArticleIcon;
    }
};