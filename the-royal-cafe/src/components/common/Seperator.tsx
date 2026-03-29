type SeparatorProps = {
  className?: string;
};

const Separator = ({ className = "" }: SeparatorProps) => {
  return <div className={`w-full h-[50px] bg-brand ${className}`} />;
};

export default Separator;
