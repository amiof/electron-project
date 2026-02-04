import * as React from "react"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

const FileSizeIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <defs>
      {/* Central highlight circle on the file */}
      <linearGradient id="color-1" x1="32" y1="21" x2="32" y2="31.5">
        <stop offset="0" stopColor="#95facc" />
        <stop offset="1" stopColor="#6ec8ff" />
      </linearGradient>
      
      {/* Main file body */}
      <linearGradient id="color-2" x1="32" y1="7.167" x2="32" y2="58.22">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Right bottom bar */}
      <linearGradient id="color-3" x1="48" y1="7.167" x2="48" y2="58.22">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Left bottom bars */}
      <linearGradient id="color-4" x1="13" y1="7.167" x2="13" y2="58.22">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      <linearGradient id="color-5" x1="21" y1="7.167" x2="21" y2="58.22">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      <linearGradient id="color-6" x1="29" y1="7.167" x2="29" y2="58.22">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
    </defs>
    
    {/* Central circle highlight */}
    <path
      d="M32,21.999c-2.20914,0 -4,1.79086 -4,4c0,2.20914 1.79086,4 4,4c2.20914,0 4,-1.79086 4,-4c0,-2.20914 -1.79086,-4 -4,-4z"
      fill="url(#color-1)"
    />
    
    {/* Main file shape with folded corner and bottom bars */}
    <path
      d="M57.833,43.14l-7.16,-32.222c-0.513,-2.307 -2.521,-3.918 -4.884,-3.918h-27.578c-2.363,0 -4.372,1.611 -4.884,3.918l-7.16,32.221c-0.111,0.498 -0.167,1.008 -0.167,1.519v1.342v2v6c0,1.654 1.346,3 3,3h46c1.654,0 3,-1.346 3,-3v-6v-2v-1.342c0,-0.511 -0.056,-1.021 -0.167,-1.518zM15.279,11.352c0.308,-1.385 1.514,-2.352 2.932,-2.352h27.577c1.418,0 2.624,0.967 2.932,2.352l5.256,23.648h-3.976v2h4.42l0.444,2h-8.864v2h9.309l0.47,2.115c-0.25,-0.067 -0.508,-0.115 -0.779,-0.115h-15.403l-2.197,-4.081c5.189,-2.16 8.6,-7.214 8.6,-12.92c0,-7.72 -6.28,-14 -14,-14c-7.72,0 -14,6.28 -14,14c0,5.706 3.411,10.76 8.6,12.92l-2.197,4.081h-15.403c-0.271,0 -0.529,0.048 -0.779,0.115l0.47,-2.115h9.309v-2h-8.865l0.444,-2h4.421v-2h-3.976zM34.637,33.787c-0.523,-0.971 -1.534,-1.574 -2.637,-1.574c-1.103,0 -2.114,0.604 -2.637,1.575l-1.807,3.357c-4.55,-1.81 -7.556,-6.189 -7.556,-11.146c0,-6.617 5.383,-12 12,-12c6.617,0 12,5.383 12,12c0,4.958 -3.006,9.337 -7.555,11.146zM31.124,34.736c0.254,-0.473 0.698,-0.523 0.876,-0.523c0.178,0 0.622,0.051 0.876,0.522l4.451,8.265h-10.654zM56,54c0,0.552 -0.449,1 -1,1h-46c-0.551,0 -1,-0.448 -1,-1v-6v-2c0,-0.552 0.449,-1 1,-1h46c0.551,0 1,0.448 1,1v2z"
      fill="url(#color-2)"
    />
    
    {/* Right large bottom bar */}
    <path
      d="M52,47h-8c-1.103,0 -2,0.897 -2,2v2c0,1.103 0.897,2 2,2h8c1.103,0 2,-0.897 2,-2v-2c0,-1.103 -0.897,-2 -2,-2zM52,51h-8v-2h8z"
      fill="url(#color-3)"
    />
    
    {/* Left bottom bars */}
    <path
      d="M14,47h-2c-1.103,0 -2,0.897 -2,2v2c0,1.103 0.897,2 2,2h2c1.103,0 2,-0.897 2,-2v-2c0,-1.103 -0.897,-2 -2,-2zM14,51h-2v-2h2z"
      fill="url(#color-4)"
    />
    <path
      d="M22,47h-2c-1.103,0 -2,0.897 -2,2v2c0,1.103 0.897,2 2,2h2c1.103,0 2,-0.897 2,-2v-2c0,-1.103 -0.897,-2 -2,-2zM22,51h-2v-2h2z"
      fill="url(#color-5)"
    />
    <path
      d="M30,47h-2c-1.103,0 -2,0.897 -2,2v2c0,1.103 0.897,2 2,2h2c1.103,0 2,-0.897 2,-2v-2c0,-1.103 -0.897,-2 -2,-2zM30,51h-2v-2h2z"
      fill="url(#color-6)"
    />
  </SvgIcon>
)

export default FileSizeIcon