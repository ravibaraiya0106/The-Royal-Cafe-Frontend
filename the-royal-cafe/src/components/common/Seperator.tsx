type SeparatorProps = {
  className?: string;
};

const Separator = ({ className = "" }: SeparatorProps) => {
  return <div className={`w-full h-[20px] bg-brand ${className}`} />;
};

export default Separator;
