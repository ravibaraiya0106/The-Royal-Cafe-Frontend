import { CONTACT_ITEMS } from "@/constants/footer";

const FooterContactItems = () => {
  return (
    <ul className="mt-4 space-y-3 text-sm text-gray-600 flex flex-col items-center sm:items-start">
      {CONTACT_ITEMS.map((item) => (
        <li
          key={item.label}
          className="flex items-center justify-center gap-3 sm:justify-start sm:items-start"
        >
          <item.icon className="text-brand mt-1" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
};

export default FooterContactItems;

