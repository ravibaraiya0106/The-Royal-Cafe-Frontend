import { SOCIAL_LINKS } from "@/constants/Footer";
import SocialIcon from "./SocialIcon";

const FooterSocialIcons = () => {
  return (
    <div className="mt-5 flex flex-wrap justify-center sm:justify-start items-center gap-3">
      {SOCIAL_LINKS.map((item) => (
        <SocialIcon
          key={item.label}
          icon={item.icon}
          label={item.label}
          url={item.url}
        />
      ))}
    </div>
  );
};

export default FooterSocialIcons;
