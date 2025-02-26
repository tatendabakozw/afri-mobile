import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface HomeIconProps {
  fill?: string;
  width?: number;
  height?: number;
  size?: number;
}

const HomeIcon = ({ fill = "#000", width, height, size }: HomeIconProps) => (
  <Svg
    width={width || size}
    height={height || size}
    fill="none"
  >
     <Path
      fill={fill}
      fillRule="evenodd"
      d="M2.335 7.875c-.54 1.127-.35 2.446.03 5.083l.278 1.937c.487 3.388.73 5.081 1.906 6.093C5.724 22 7.447 22 10.894 22h2.212c3.447 0 5.17 0 6.345-1.012 1.175-1.012 1.419-2.705 1.906-6.093l.279-1.937c.38-2.637.57-3.956.029-5.083-.541-1.127-1.691-1.813-3.992-3.183l-1.385-.825C14.2 2.622 13.154 2 12 2c-1.154 0-2.2.622-4.288 1.867l-1.385.825c-2.3 1.37-3.451 2.056-3.992 3.183ZM8.25 18a.75.75 0 0 1 .75-.75h6a.75.75 0 1 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </Svg>
)

export default HomeIcon