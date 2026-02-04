import * as React from "react"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

const FolderIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <defs>
      {/* Bottom folder tab */}
      <linearGradient id="color-1" x1="14.296" y1="42.833" x2="14.296" y2="53.022">
        <stop offset="0" stopColor="#95facc" />
        <stop offset="1" stopColor="#6ec8ff" />
      </linearGradient>
      
      {/* Main phone body */}
      <linearGradient id="color-2" x1="32" y1="8" x2="32" y2="55.938">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Top status bar */}
      <linearGradient id="color-3" x1="33" y1="8" x2="33" y2="55.938">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Right-side lines (possibly signal or buttons) */}
      <linearGradient id="color-4" x1="49" y1="8" x2="49" y2="55.938">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Small inner bars */}
      <linearGradient id="color-6" x1="32" y1="8" x2="32" y2="55.938">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
    </defs>
    
    {/* Folder tab at bottom */}
    <path
      d="M11.702,43.702l6.596,6.596c0.628,0.628 0.183,1.702 -0.705,1.702h-5.593c-1.105,0 -2,-0.895 -2,-2v-5.593c0,-0.888 1.074,-1.333 1.702,-0.705z"
      fill="url(#color-1)"
    />
    
    {/* Main phone body with screen and folder */}
    <path
      d="M55,20h-1v-6c0,-1.654 -1.346,-3 -3,-3v-1c0,-1.103 -0.897,-2 -2,-2h-34c-1.103,0 -2,0.897 -2,2v1c-1.654,0 -3,1.346 -3,3v6h-1c-1.654,0 -3,1.346 -3,3v6v1v21c0,2.757 2.243,5 5,5h42c2.757,0 5,-2.243 5,-5v-20v-2v-6c0,-1.654 -1.346,-3 -3,-3zM55,22c0.552,0 1,0.448 1,1v2.026c-0.584,-0.442 -1.257,-0.773 -2,-0.925v-2.101zM15,10h34v1h-34zM13,13h38c0.552,0 1,0.448 1,1v10h-9.929c-1.007,0 -1.94,0.5 -2.497,1.337l-2.813,4.218c-0.186,0.278 -0.496,0.445 -0.832,0.445h-7.857c-0.336,0 -0.646,-0.167 -0.833,-0.446l-2.813,-4.216c-0.557,-0.838 -1.49,-1.338 -2.497,-1.338h-9.929v-10c0,-0.552 0.448,-1 1,-1zM9,22h1v2.101c-0.743,0.152 -1.416,0.482 -2,0.925v-2.026c0,-0.552 0.448,-1 1,-1zM56,51c0,1.654 -1.346,3 -3,3h-42c-1.654,0 -3,-1.346 -3,-3v-21v-1c0,-1.654 1.346,-3 3,-3h10.929c0.336,0 0.646,0.167 0.833,0.446l2.813,4.216c0.556,0.838 1.489,1.338 2.496,1.338h7.857c1.007,0 1.94,-0.5 2.497,-1.337l2.813,-4.218c0.187,-0.278 0.497,-0.445 0.833,-0.445h10.929c1.654,0 3,1.346 3,3v2z"
      fill="url(#color-2)"
    />
    
    {/* Top status bar */}
    <path d="M21,17h24v2h-24z" fill="url(#color-3)" />
    
    {/* Right side lines */}
    <path d="M44,50h10v2h-10z" fill="url(#color-4)" />
    <path d="M44,46h10v2h-10z" fill="url(#color-4)" />
    
    {/* Small inner folder bars */}
    <path d="M27,21h10v2h-10z" fill="url(#color-6)" />
    <path d="M29,25h6v2h-6z" fill="url(#color-6)" />
  </SvgIcon>
)

export default FolderIcon