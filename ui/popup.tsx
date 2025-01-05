import { CSSProperties, FC } from "react"

interface PositionLocation {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;

}

interface PopupProps {
  body: string;
  style?: PositionLocation
}

const Popup: FC<PopupProps> = ({ body, style }) => {
  return (
    <div className="popup-wrap" style={style} >
      <div className="popup">
        {body}
      </div>
    </div>
  )
}

export default Popup