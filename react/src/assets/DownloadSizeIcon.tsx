import * as React from "react"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

const DownloadSizeIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <defs>
      {/* Main download arrow */}
      <linearGradient id="color-1" x1="32" y1="5.833" x2="32" y2="59.624">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Upper size bar */}
      <linearGradient id="color-2" x1="32" y1="5.833" x2="32" y2="59.624">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Top size bar */}
      <linearGradient id="color-3" x1="32" y1="5.833" x2="32" y2="59.624">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Arrow highlight/shine */}
      <linearGradient id="color-4" x1="32" y1="25.5" x2="32" y2="45.37">
        <stop offset="0" stopColor="#95facc" />
        <stop offset="1" stopColor="#6ec8ff" />
      </linearGradient>
      
      {/* Bottom tray/base */}
      <linearGradient id="color-5" x1="32" y1="5.833" x2="32" y2="59.624">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
    </defs>
    
    {/* Main download arrow pointing down */}
    <path
      d="M32,49.017c-0.853,0 -1.674,-0.36 -2.252,-0.986l-8.931,-9.671c-0.547,-0.593 -0.687,-1.421 -0.363,-2.16c0.324,-0.739 1.026,-1.2 1.834,-1.2h4.712v-11c0,-1.103 0.897,-2 2,-2h6c1.103,0 2,0.897 2,2v11h4.712c0.807,0 1.51,0.459 1.833,1.199c0.323,0.74 0.185,1.567 -0.363,2.16l-8.931,9.671c-0.577,0.627 -1.398,0.987 -2.251,0.987zM22.288,37l8.93,9.674c0.407,0.441 1.157,0.441 1.564,0l8.931,-9.671l-6.713,-0.003v-13h-6v13z"
      fill="url(#color-1)"
    />
    
    {/* Middle size indicator bar */}
    <path
      d="M35,20h-6c-1.103,0 -2,-0.897 -2,-2v-2c0,-1.103 0.897,-2 2,-2h6c1.103,0 2,0.897 2,2v2c0,1.103 -0.897,2 -2,2zM35,15.999l-6,0.001v2h6z"
      fill="url(#color-2)"
    />
    
    {/* Top size indicator bar */}
    <path
      d="M35,12h-6c-1.103,0 -2,-0.897 -2,-2v-2c0,-1.103 0.897,-2 2,-2h6c1.103,0 2,0.897 2,2v2c0,1.103 -0.897,2 -2,2zM35,7.999l-6,0.001v2h6z"
      fill="url(#color-3)"
    />
    
    {/* Arrow shaft highlight */}
    <path
      d="M35.934,39h-2.934v-13h-2v13h-2.934c-0.423,0 -0.654,0.494 -0.383,0.819l3.549,4.259c0.4,0.48 1.137,0.48 1.537,0l3.549,-4.259c0.271,-0.325 0.04,-0.819 -0.384,-0.819z"
      fill="url(#color-4)"
    />
    
    {/* Bottom tray/base line */}
    <path
      d="M54,58h-44c-1.103,0 -2,-0.897 -2,-2v-19c0,-1.103 0.897,-2 2,-2h2c1.103,0 2,0.897 2,2v15h36v-15c0,-1.103 0.897,-2 2,-2h2c1.103,0 2,0.897 2,2v19c0,1.103 -0.897,2 -2,2zM10,37v19h44v-19h-2v17h-40v-17z"
      fill="url(#color-5)"
    />
  </SvgIcon>
)

export default DownloadSizeIcon