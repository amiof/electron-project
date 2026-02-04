import * as React from "react"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

const TimeEtaIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 64 64">
    <defs>
      {/* Small highlight circle at top-left */}
      <linearGradient id="color-1" x1="16" y1="15.188" x2="16" y2="22.483">
        <stop offset="0" stopColor="#95facc" />
        <stop offset="1" stopColor="#6ec8ff" />
      </linearGradient>
      
      {/* Right-side clock hand/orbit segment */}
      <linearGradient id="color-2" x1="40" y1="5.5" x2="40" y2="59.001">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Left clock face and outer ring parts */}
      <linearGradient id="color-3" x1="16" y1="5.5" x2="16" y2="59.001">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Clock hands and center details */}
      <linearGradient id="color-4" x1="33" y1="5.5" x2="33" y2="59.001">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Main outer ring */}
      <linearGradient id="color-5" x1="33" y1="5.5" x2="33" y2="59.001">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
      
      {/* Outer border and arrow details */}
      <linearGradient id="color-6" x1="33" y1="5.5" x2="33" y2="59.001">
        <stop offset="0" stopColor="#2af598" />
        <stop offset="1" stopColor="#009efd" />
      </linearGradient>
    </defs>
    
    {/* Highlight dot on the clock rim */}
    <path
      d="M16,16c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3z"
      fill="url(#color-1)"
    />
    
    {/* Partial clock arc (right side) */}
    <path d="M33,50c7.72,0 14,-6.28 14,-14h-2c0,6.617 -5.383,12 -12,12z" fill="url(#color-2)" />
    
    {/* Main clock face with inner circle */}
    <path
      d="M16,26c3.859,0 7,-3.141 7,-7c0,-3.859 -3.141,-7 -7,-7c-3.859,0 -7,3.141 -7,7c0,3.859 3.141,7 7,7zM16,14c2.757,0 5,2.243 5,5c0,2.757 -2.243,5 -5,5c-2.757,0 -5,-2.243 -5,-5c0,-2.757 2.243,-5 5,-5z"
      fill="url(#color-3)"
    />
    
    {/* Clock hands */}
    <path
      d="M32,26v6.142c-1.72,0.447 -3,1.999 -3,3.858c0,2.206 1.794,4 4,4c2.206,0 4,-1.794 4,-4c0,-1.859 -1.28,-3.411 -3,-3.858v-6.142zM35,36c0,1.103 -0.897,2 -2,2c-1.103,0 -2,-0.897 -2,-2c0,-1.103 0.897,-2 2,-2c1.103,0 2,0.897 2,2z"
      fill="url(#color-4)"
    />
    
    {/* Large orbiting ring */}
    <path
      d="M17,36c0,-1.946 0.345,-3.846 1.024,-5.646l-1.871,-0.707c-0.765,2.027 -1.153,4.165 -1.153,6.353c0,9.925 8.075,18 18,18c9.925,0 18,-8.075 18,-18c0,-9.925 -8.075,-18 -18,-18c-2.094,0 -4.145,0.356 -6.096,1.06l0.678,1.881c1.733,-0.625 3.557,-0.941 5.418,-0.941c8.822,0 16,7.178 16,16c0,8.822 -7.178,16 -16,16c-8.822,0 -16,-7.178 -16,-16z"
      fill="url(#color-5)"
    />
    
    {/* Outer border ring with arrow-like details */}
    <path
      d="M50.524,22.718l2.861,-2.861c0.78,-0.779 0.78,-2.049 0,-2.828l-1.414,-1.414c-0.779,-0.779 -2.049,-0.779 -2.828,0l-2.861,2.861c-3.445,-2.618 -7.681,-4.244 -12.282,-4.451v-2.025h2c1.103,0 2,-0.897 2,-2v-2c0,-1.103 -0.897,-2 -2,-2h-6c-1.103,0 -2,0.897 -2,2v2c0,1.103 0.897,2 2,2h2v2.042c-2.169,0.097 -4.296,0.491 -6.333,1.211l0.666,1.885c2.136,-0.755 4.379,-1.138 6.667,-1.138c11.028,0 20,8.972 20,20c0,11.028 -8.972,20 -20,20c-11.028,0 -20,-8.972 -20,-20c0,-2.288 0.383,-4.531 1.138,-6.667l-1.885,-0.666c-0.831,2.35 -1.253,4.816 -1.253,7.333c0,12.131 9.869,22 22,22c12.131,0 22,-9.869 22,-22c0,-4.986 -1.67,-9.588 -4.476,-13.282zM30,8h6l0.002,2h-6.002zM47.825,19.761l2.731,-2.731l1.414,1.414l-2.731,2.731c-0.449,-0.492 -0.922,-0.965 -1.414,-1.414z"
      fill="url(#color-6)"
    />
  </SvgIcon>
)

export default TimeEtaIcon