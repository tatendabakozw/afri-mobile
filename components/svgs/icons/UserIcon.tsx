import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface UserIconProps {
  fill?: string;
  width?: number;
  height?: number;
  size?: number;
}

const UserIcon = ({ fill = "#000", width, height, size = 24 }: UserIconProps) => (
  <Svg
    width={width || size}
    height={height || size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill={fill}
      d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"
    />
  </Svg>
)

export default UserIcon