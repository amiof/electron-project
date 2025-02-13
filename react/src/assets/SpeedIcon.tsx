import {SvgIcon} from "@mui/material";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";

const SpeedIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 30 30">
            <path
                d="M14.703 5.572a12 12 0 0 0-12 12 12 12 0 0 0 .69 3.965 10.747 10.747 0 0 1-.295-2.443 10.747 10.747 0 0 1 10.746-10.746 10.747 10.747 0 0 1 5.983 1.826l2.14-2.14a12 12 0 0 0-7.264-2.462zm9.148 3.604a1 1 0 0 0-.719.281l-9.193 7.781c-.423.358-1.416 1.412-.002 2.826 1.414 1.414 2.468.419 2.826-.004l7.783-9.19c.358-.423.392-1.022 0-1.414a1 1 0 0 0-.695-.281zm1.85 3.608l-2.022 2.022a10.747 10.747 0 0 1 .908 3.217h2.016a12 12 0 0 0 .102-1.428 12 12 0 0 0-1.002-4.79z"/>
        </SvgIcon>
    );
};

export default SpeedIcon;
