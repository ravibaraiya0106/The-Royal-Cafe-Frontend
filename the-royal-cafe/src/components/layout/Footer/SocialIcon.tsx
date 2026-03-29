import type { IconType } from "react-icons";

type SocialIconProps = {
  icon: IconType;
  label: string;
  url: string;
};

const SocialIcon = ({ icon: Icon, label, url }: SocialIconProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group h-10 w-10 rounded-full border border-brand/20 flex items-center justify-center hover:border-brand hover:bg-brand transition duration-200"
  >
    <span className="text-brand group-hover:text-white text-sm">
      <Icon />
    </span>
  </a>
);

export default SocialIcon;

