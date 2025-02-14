import * as React from "react";
import {TreeItem2Label} from "@mui/x-tree-view/TreeItem2";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

interface Props {
    children: React.ReactNode;
    icon?: React.ElementType;
    expandable?: boolean;
}

const StyledTreeItemLabelText = styled(Typography)({
    color: 'inherit',
    fontFamily: 'General Sans',
    fontWeight: 500,
}) as unknown as typeof Typography;


const CustomLabel = (props: Props) => {
    const {icon: Icon, expandable, children, ...other} = props


    function DotIcon() {
        return (
            <Box
                sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '70%',
                    bgcolor: 'warning.main',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    zIndex: 1,
                    mx: 1,
                }}
            />
        );
    }


    return (
        <TreeItem2Label
            {...other}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {Icon && (
                <Box
                    component={Icon}
                    className="labelIcon"
                    color="inherit"
                    sx={{mr: 1, fontSize: '1.2rem'}}
                />
            )}

            <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
            {expandable && <DotIcon/>}
        </TreeItem2Label>
    );
}

export default CustomLabel;