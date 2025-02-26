import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface WalletIconProps {
    fill?: string;
    width?: number;
    height?: number;
    size?: number;
  }

const RewardsIcon = ({ fill = "#000", width, height, size = 24 }:WalletIconProps) => (
  <Svg
  width={width || size}
  height={height || size}
  viewBox="0 0 24 24"
  fill="none"
  >
    <Path
      fill={fill}
      d="M11 14v8H7a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1h6Zm8 0a1 1 0 0 1 1 1v4a3 3 0 0 1-3 3h-4v-8h6ZM16.5 2a3.5 3.5 0 0 1 3.163 5H20a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-7V7h-2v5H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h.337A3.5 3.5 0 0 1 4 5.5C4 3.567 5.567 2 7.483 2c1.755-.03 3.312 1.092 4.381 2.934l.136.243c1.033-1.914 2.56-3.114 4.291-3.175L16.5 2Zm-9 2a1.5 1.5 0 1 0 0 3h3.143C9.902 5.095 8.694 3.98 7.5 4Zm8.983 0c-1.18-.02-2.385 1.096-3.126 3H16.5a1.5 1.5 0 0 0-.017-3Z"
    />
  </Svg>
)
export default RewardsIcon
