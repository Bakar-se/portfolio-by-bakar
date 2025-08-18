import { FaStrava as StravaIcon } from "react-icons/fa";
import {
  FaEnvelope as EmailIcon,
  FaFacebook as FacebookIcon,
  FaGithub as GitHubIcon,
  FaLinkedin as LinkedInIcon,
  FaXTwitter as XPlatformIcon,
} from "react-icons/fa6";
import { SocialType } from "../types";

const socialConfig: SocialType[] = [
  {
    href: "mailto:ironsamurai786@gmail.com",
    icon: EmailIcon,
    label: "Email",
  },
  {
    href: "https://github.com/Bakar-se",
    icon: GitHubIcon,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/its-bakar/",
    icon: LinkedInIcon,
    label: "LinkedIn",
  },
];

export default socialConfig;
