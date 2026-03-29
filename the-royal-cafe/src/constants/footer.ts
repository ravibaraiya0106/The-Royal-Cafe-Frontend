import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMailBulk,
  FaMapMarked,
  FaPhone,
} from "react-icons/fa";

export const SOCIAL_LINKS: Array<{
  label: string;
  url: string;
  icon: IconType;
}> = [
  { label: "Facebook", url: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", url: "https://instagram.com", icon: FaInstagram },
  { label: "Twitter", url: "https://twitter.com", icon: FaTwitter },
];

export const CONTACT_ITEMS: Array<{
  label: string;
  text: string;
  icon: IconType;
}> = [
  {
    label: "Address",
    text: "123 Royal Street, Your City",
    icon: FaMapMarked,
  },
  {
    label: "Phone",
    text: "(+00) 123 456 789",
    icon: FaPhone,
  },
  {
    label: "Email",
    text: "hello@theroyalcafe.com",
    icon: FaMailBulk,
  },
];

