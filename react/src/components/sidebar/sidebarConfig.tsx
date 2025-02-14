import {TreeViewBaseItem} from "@mui/x-tree-view/models";
import {FileType} from "@components/sidebar/utils.ts";

export type ExtendedTreeItemProps = {
    fileType?: FileType;
    id: string;
    label: string;
};

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
    {
        id: '1',
        label: 'All Downloads',
        children: [
            {id: '1.1', label: 'all', fileType: 'doc'},
            {id: '1.2', label: 'Compressed', fileType: 'doc'},
            {id: '1.6', label: 'Musics', fileType: 'doc'},
            {id: '1.3', label: 'Videos', fileType: 'doc'},
            {id: '1.4', label: 'Documents', fileType: 'pdf'},
            {id: '1.5', label: 'Images', fileType: 'video'},
        ],
    },
    {
        id: '2',
        label: 'UnFinished',
        fileType: 'pinned',
        children: [
            {id: '2.2', label: 'Compressed', fileType: 'doc'},
            {id: '2.6', label: 'Musics', fileType: 'doc'},
            {id: '2.3', label: 'Videos', fileType: 'doc'},
            {id: '2.4', label: 'Documents', fileType: 'pdf'},
            {id: '2.5', label: 'Images', fileType: 'video'},
        ],
    },
    {id: '3', label: 'Finished', fileType: 'folder'},
    {id: '4', label: 'Trash', fileType: 'trash'},
];


export default ITEMS