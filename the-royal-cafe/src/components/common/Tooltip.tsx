import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  id: string;
  content: string;
  place?: "top" | "bottom" | "left" | "right";
};

const Tooltip = ({ id, content, place = "left" }: Props) => {
  const arrowBorderClass = {
    right: "!border-b !border-r !border-brand",
    left: "!border-t !border-l !border-brand",
    top: "!border-b !border-r !border-brand",
    bottom: "!border-b !border-r !border-brand",
  }[place];

  return (
    <ReactTooltip
      id={id}
      place={place}
      content={content}
      offset={10}
      className="!bg-white !text-brand !text-xs !px-3 !py-1.5 !rounded-lg !shadow-md !border !border-brand z-50"
      classNameArrow={`!bg-white ${arrowBorderClass}`}
    />
  );
};

export default Tooltip;
