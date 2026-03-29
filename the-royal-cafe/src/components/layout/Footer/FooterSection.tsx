import type { ReactNode } from "react";

type FooterSectionProps = {
  title: string;
  children: ReactNode;
};

const FooterSection = ({ title, children }: FooterSectionProps) => (
  <div>
    <p className="text-sm font-semibold text-brand uppercase tracking-wide">
      {title}
    </p>
    {children}
  </div>
);

export default FooterSection;
