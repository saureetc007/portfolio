import type { NavLink, Profile, SocialLink } from '@/types/content';

export const profile: Profile = {
  name: 'Saureet Chakrabarti',
  firstName: 'Saureet',
  degree: 'B.Tech in Computer Science and Artificial Intelligence',
  university: 'Newton School of Technology',
  institution: 'Newton School of Technology',
  graduationYear: 2028,
  email: 'saureetc007@gmail.com',

  about: [
    "I'm studying Computer Science and Artificial Intelligence at Newton School of Technology, with a core philosophy of learning by building.",
    'Rather than just studying theoretical concepts in isolation, I develop practical software projects, explore applied AI architectures, and continuously refine algorithmic problem-solving skills.',
    'I thrive in collaborative engineering environments, hackathons, and creative technical challenges where software meets thoughtful user experience.',
  ],
};

export const socialLinks: SocialLink[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/saureetc007' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/saureet-chakrabarti-140a59238/',
  },
];

export const githubProfileUrl = socialLinks[0].href;

export const navLinks: NavLink[] = [
  { label: 'Home', target: 'top' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'About', target: 'about' },
  { label: 'Contact', target: 'contact' },
];

/** Every section id on the page, in order (used by the scroll-spy). */
export const sectionIds = ['top', 'skills', 'projects', 'universe', 'about', 'contact'] as const;
