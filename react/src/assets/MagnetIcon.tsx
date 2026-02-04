import * as React from "react"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

const MagnetIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <defs>
      {/* Right magnet pole and ring */}
      <linearGradient id="color-1" x1="46" y1="5.167" x2="46" y2="60.861">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Left magnet arm and base */}
      <linearGradient id="color-2" x1="27" y1="5.167" x2="27" y2="60.861">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Top-right handle detail */}
      <linearGradient id="color-3" x1="46" y1="10" x2="46" y2="23.359">
        <stop offset="0" stopColor="#95facc" />
        <stop offset="1" stopColor="#6ec8ff" />
      </linearGradient>
      
      {/* Horizontal bar on right pole */}
      <linearGradient id="color-4" x1="46" y1="10" x2="46" y2="23.359">
        <stop offset="0" stopColor="#95facc" />
        <stop offset="1" stopColor="#6ec8ff" />
      </linearGradient>
      
      {/* Attraction field lines in center */}
      <linearGradient id="color-5" x1="27" y1="5.167" x2="27" y2="60.861">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
    </defs>
    
    {/* Right circular pole with inner ring */}
    <path
      d="M46,28c-6.065,0 -11,-4.935 -11,-11c0,-6.065 4.935,-11 11,-11c6.065,0 11,4.935 11,11c0,6.065 -4.935,11 -11,11zM46,8c-4.963,0 -9,4.037 -9,9c0,4.963 4.037,9 9,9c4.963,0 9,-4.037 9,-9c0,-4.963 -4.037,-9 -9,-9z"
      fill="url(#color-1)"
    />
    
    {/* Left arm and base of the horseshoe magnet */}
    <path
      d="M45,38c0,9.925 -8.075,18 -18,18c-9.925,0 -18,-8.075 -18,-18v-14h2c4.625,0 8.445,-3.506 8.944,-8h13.056v-2h-15v1c0,3.859 -3.141,7 -7,7h-4v16c0,11.028 8.972,20 20,20c11.028,0 20,-8.972 20,-20v-8h-2z"
      fill="url(#color-2)"
    />
    
    {/* Top-right handle cross */}
    <path d="M47,14v-3h-2v3h-3v2h3v3h2v-3h3v-2z" fill="url(#color-3)" />
    
    {/* Horizontal bar on right pole */}
    <path d="M42,21h8v2h-8z" fill="url(#color-4)" />
    
    {/* Magnetic field lines between poles */}
    <path
      d="M18,27v13c0,4.963 4.037,9 9,9c4.963,0 9,-4.037 9,-9v-13h-6v13c0,1.654 -1.346,3 -3,3c-1.654,0 -3,-1.346 -3,-3v-13zM27,45c2.757,0 5,-2.243 5,-5v-9h2v9c0,3.859 -3.141,7 -7,7c-3.859,0 -7,-3.141 -7,-7v-9h2v9c0,2.757 2.243,5 5,5z"
      fill="url(#color-5)"
    />
  </SvgIcon>
)

export default MagnetIcon