import styles from "./style.module.scss"
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';
import ITEMS from "@components/sidebar/sidebarConfig.tsx";
import CustomTreeItem from "@components/sidebar/CustomTreeItem.tsx";


const Sidebar = () => {
    return (
        <div className={styles.container}>
            <RichTreeView
                items={ITEMS}
                defaultExpandedItems={['1']}
                defaultSelectedItems="1"
                sx={{height: 'fit-content', flexGrow: 1, maxWidth: "90%", overflowY: 'auto'}}
                slots={{item: CustomTreeItem}}
            />
        </div>
    );
}

export default Sidebar;