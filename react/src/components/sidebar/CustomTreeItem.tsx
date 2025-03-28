import * as React from "react"
import { useTreeItem2, UseTreeItem2Parameters } from "@mui/x-tree-view/useTreeItem2"
import FolderRounded from "@mui/icons-material/FolderRounded"
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider"
import clsx from "clsx"
import { TreeItem2Checkbox, TreeItem2Content, TreeItem2IconContainer, TreeItem2Root } from "@mui/x-tree-view/TreeItem2"
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon"
import { TreeItem2DragAndDropOverlay } from "@mui/x-tree-view/TreeItem2DragAndDropOverlay"
import { styled } from "@mui/material/styles"
import { treeItemClasses } from "@mui/x-tree-view/TreeItem"
import CustomLabel from "@components/sidebar/CustomLabel.tsx"
import { animated, useSpring } from "@react-spring/web"
import Collapse from "@mui/material/Collapse"
import { TransitionProps } from "@mui/material/transitions"
import { getIconFromFileType } from "@components/sidebar/utils.ts"


interface CustomTreeItemProps
    extends Omit<UseTreeItem2Parameters, 'rootRef'>,
        Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({theme}) => ({
    color: theme.palette.grey[400],
    position: 'relative',
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
    },
    ...theme.applyStyles('light', {
        color: theme.palette.grey[800],
    }),
})) as unknown as typeof TreeItem2Root;


const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {

    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}


const CustomTreeItemContent = styled(TreeItem2Content)(({theme}) => ({
    flexDirection: 'row-reverse',
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    color: theme.palette.grey[500],
    fontWeight: 500,
    [`&.Mui-expanded `]: {
        '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
            color: theme.palette.success.dark,
            ...theme.applyStyles('light', {
                color: theme.palette.success.main,
            }),
        },
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '16px',
            top: '44px',
            height: 'calc(100% - 48px)',
            width: '1.5px',
            backgroundColor: theme.palette.grey[700],
            ...theme.applyStyles('light', {
                backgroundColor: theme.palette.grey[300],
            }),
        },
    },
    '&:hover': {
        backgroundColor: "rgba(255,255,255, 0.1)",
        color: 'white',
        ...theme.applyStyles('light', {
            color: "green",
        }),
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
        background: "linear-gradient(170deg, hsla(204, 83%, 51%, 0.8) 0%, hsla(143, 100%, 48%, 0.8) 100%)",
        color: theme.palette.primary.contrastText,
        ".labelIcon": {
            color: "white"
        },
        ...theme.applyStyles('light', {
            backgroundColor: "green",
        }),
    },
}));


const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const {id, itemId, label, disabled, children, ...other} = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        getDragAndDropOverlayProps,
        status,
        publicAPI,
    } = useTreeItem2({id, itemId, children, label, disabled, rootRef: ref});

    const isExpandable = (reactChildren: React.ReactNode) => {
        if (Array.isArray(reactChildren)) {
            return reactChildren.length > 0 && reactChildren.some(isExpandable);
        }
        return Boolean(reactChildren);
    };


    const item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    let icon;
    if (expandable) {
        icon = FolderRounded;
    } else if (item.fileType) {
        icon = getIconFromFileType(item.fileType);
    }


    return (
        <TreeItem2Provider itemId={itemId}>
            <StyledTreeItemRoot {...getRootProps(other)}>
                <div onClick={() => console.log(label)}>
                    <CustomTreeItemContent
                        {...getContentProps({
                            className: clsx('content', {
                                'Mui-expanded': status.expanded,
                                'Mui-selected': status.selected,
                                'Mui-focused': status.focused,
                                'Mui-disabled': status.disabled,
                            }),
                        })}

                    >
                        <TreeItem2IconContainer {...getIconContainerProps()}>
                            <TreeItem2Icon status={status}/>
                        </TreeItem2IconContainer>
                        <TreeItem2Checkbox {...getCheckboxProps()} />
                        <CustomLabel
                            {...getLabelProps({icon, expandable: expandable && status.expanded})}
                        />
                        <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
                    </CustomTreeItemContent>
                </div>
                {children && <TransitionComponent {...getGroupTransitionProps()} />}
            </StyledTreeItemRoot>
        </TreeItem2Provider>
    );
});

export default CustomTreeItem