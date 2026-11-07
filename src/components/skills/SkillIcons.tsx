interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function SkillIcon({ name, className = 'skill-tech-icon', size = 20 }: IconProps) {
  const norm = name.toLowerCase().replace(/[\s\-_/.]/g, '');

  switch (norm) {
    // 01 — Code & Engineering
    case 'python':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M11.91 2c-5.26 0-4.93 2.28-4.93 2.28l.01 2.37h5.02v.71H4.96S2 7.02 2 12.3c0 5.27 2.58 5.08 2.58 5.08h1.54v-2.17s-.08-2.58 2.54-2.58h4.97v-.73H8.64s-2.53-.12-2.53-2.53c0-2.42 2.53-2.37 2.53-2.37h8.21s2.29-.02 2.29-2.22c0-2.19-2.02-2.78-2.02-2.78L11.91 2Zm-2.76 1.45a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"
            fill="#3572A5"
          />
          <path
            d="M12.09 22c5.26 0 4.93-2.28 4.93-2.28l-.01-2.37h-5.02v-.71h7.05s2.96.34 2.96-4.94c0-5.27-2.58-5.08-2.58-5.08h-1.54v2.17s.08 2.58-2.54 2.58h-4.97v.73h4.99s2.53.12 2.53 2.53c0 2.42-2.53 2.37-2.53 2.37H9.15s-2.29.02-2.29 2.22c0 2.19 2.02 2.78 2.02 2.78L12.09 22Zm2.76-1.45a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z"
            fill="#FFD43B"
          />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path
            d="M7 16.5c.5.8 1.2 1.3 2.2 1.3 1.2 0 2-.8 2-2.5V8h2.3v7.3c0 3-1.8 4.5-4.3 4.5-2 0-3.3-1-3.9-2.3l1.7-1Zm8.2-1.2c.7.8 1.7 1.3 2.8 1.3 1.2 0 2-.6 2-1.5 0-1-1-1.5-2.6-2-2.2-.7-3.7-1.6-3.7-3.7 0-2.1 1.6-3.6 4.1-3.6 1.8 0 3 .6 3.8 1.8l-1.8 1.2c-.5-.7-1.1-1-2-1-.9 0-1.6.5-1.6 1.2 0 .9.8 1.3 2.3 1.8 2.5.8 4 1.7 4 3.9 0 2.3-1.8 3.8-4.5 3.8-2.3 0-3.8-.9-4.6-2.3l1.7-1.5Z"
            fill="#000000"
          />
        </svg>
      );

    // 02 — Web Development
    case 'html':
    case 'html5':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 3l1.6 18 6.4 1.8 6.4-1.8L20 3H4z" fill="#E44D26" />
          <path d="M12 4.5v16.7l5-1.4 1.3-15.3H12z" fill="#F16529" />
          <path d="M7.7 7.5h8.6l-.2 2.3H12v2.3h3.8l-.4 4.5-3.4 1-3.4-1-.2-2.7h2.2l.1 1.4 1.3.4 1.3-.4.2-2.2H7.9l-.2-5.6z" fill="#FFFFFF" />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 3l1.6 18 6.4 1.8 6.4-1.8L20 3H4z" fill="#1572B6" />
          <path d="M12 4.5v16.7l5-1.4 1.3-15.3H12z" fill="#33A9DC" />
          <path d="M16.3 7.5H7.7l.2 2.3h6.2l-.2 2.3H7.9l.2 2.3h5.8l-.3 3.3-1.6.5-1.6-.5-.1-1.3H8.1l.2 2.5 3.7 1.1 3.7-1.1.6-8.2z" fill="#FFFFFF" />
        </svg>
      );

    case 'tailwindcss':
    case 'tailwind':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
            fill="#38BDF8"
          />
        </svg>
      );

    // 03 — AI & Data Intelligence
    case 'aiml':
    case 'ai':
    case 'ml':
    case 'artificialintelligence':
    case 'machinelearning':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" fill="#E50914" stroke="#E50914" />
          <circle cx="6" cy="18" r="2.5" fill="#E50914" stroke="#E50914" />
          <circle cx="18" cy="6" r="2.5" fill="#E50914" stroke="#E50914" />
          <circle cx="18" cy="18" r="2.5" fill="#E50914" stroke="#E50914" />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" stroke="#FFFFFF" />
          <line x1="8.5" y1="7" x2="9.5" y2="10" stroke="#E50914" strokeWidth="1.5" />
          <line x1="8.5" y1="17" x2="9.5" y2="14" stroke="#E50914" strokeWidth="1.5" />
          <line x1="15.5" y1="7" x2="14.5" y2="10" stroke="#E50914" strokeWidth="1.5" />
          <line x1="15.5" y1="17" x2="14.5" y2="14" stroke="#E50914" strokeWidth="1.5" />
        </svg>
      );

    case 'generativeai':
    case 'genai':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.3 8.7L21 11L14.3 13.3L12 20L9.7 13.3L3 11L9.7 8.7L12 2Z" fill="#E50914" />
          <path d="M19 16L20.2 19.3L23.5 20.5L20.2 21.7L19 25L17.8 21.7L14.5 20.5L17.8 19.3L19 16Z" fill="#FF8A8A" transform="scale(0.8) translate(3, -2)" />
        </svg>
      );

    case 'linearregression':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <line x1="3" y1="21" x2="21" y2="21" stroke="#808080" />
          <line x1="3" y1="3" x2="3" y2="21" stroke="#808080" />
          <circle cx="7" cy="17" r="1.5" fill="#E50914" stroke="#E50914" />
          <circle cx="10" cy="13" r="1.5" fill="#E50914" stroke="#E50914" />
          <circle cx="14" cy="12" r="1.5" fill="#E50914" stroke="#E50914" />
          <circle cx="18" cy="7" r="1.5" fill="#E50914" stroke="#E50914" />
          <line x1="5" y1="18" x2="20" y2="6" stroke="#27C93F" strokeWidth="2" strokeDasharray="2,2" />
        </svg>
      );

    case 'numpy':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="2" fill="#013243" stroke="#4dabf7" strokeWidth="1.5" />
          <rect x="13" y="2" width="9" height="9" rx="2" fill="#013243" stroke="#4dabf7" strokeWidth="1.5" />
          <rect x="2" y="13" width="9" height="9" rx="2" fill="#013243" stroke="#4dabf7" strokeWidth="1.5" />
          <rect x="13" y="13" width="9" height="9" rx="2" fill="#E50914" stroke="#ff8787" strokeWidth="1.5" />
          <text x="6.5" y="8" fontSize="6" fontWeight="bold" fill="#4dabf7" textAnchor="middle">N</text>
          <text x="17.5" y="8" fontSize="6" fontWeight="bold" fill="#4dabf7" textAnchor="middle">P</text>
        </svg>
      );

    case 'pandas':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="4" height="18" rx="1.5" fill="#150458" />
          <rect x="9" y="7" width="4" height="14" rx="1.5" fill="#E70488" />
          <rect x="15" y="3" width="4" height="10" rx="1.5" fill="#00A3E0" />
          <circle cx="17" cy="17" r="2.2" fill="#FFD13B" />
        </svg>
      );

    case 'sql':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#E50914" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="#E50914" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="#E50914" />
        </svg>
      );

    case 'dataanalysis':
    case 'analytics':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <line x1="18" y1="20" x2="18" y2="10" stroke="#E50914" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="20" x2="12" y2="4" stroke="#3178C6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="20" x2="6" y2="14" stroke="#27C93F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 11l6-5 5 4 5-6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'localaimodels':
    case 'localllm':
    case 'ollama':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="4" stroke="#E50914" />
          <circle cx="12" cy="12" r="3.5" fill="#E50914" stroke="#FFFFFF" strokeWidth="1.2" />
          <line x1="12" y1="1" x2="12" y2="4" stroke="#E50914" />
          <line x1="12" y1="20" x2="12" y2="23" stroke="#E50914" />
          <line x1="1" y1="12" x2="4" y2="12" stroke="#E50914" />
          <line x1="20" y1="12" x2="23" y2="12" stroke="#E50914" />
        </svg>
      );

    // 04 — Design & Digital Creation
    case 'uiux':
    case 'ui':
    case 'ux':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 19l7-7 3 3-7 7-3-3z" fill="#E50914" stroke="#E50914" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="#FFFFFF" />
          <path d="M2 2l7.586 7.586" stroke="#E50914" />
          <circle cx="11" cy="11" r="2" fill="#E50914" />
        </svg>
      );

    case 'interfacedesign':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="#FFFFFF" />
          <line x1="3" y1="8" x2="21" y2="8" stroke="#808080" />
          <line x1="9" y1="8" x2="9" y2="21" stroke="#808080" />
          <rect x="12" y="11" width="6" height="3" rx="1" fill="#E50914" stroke="#E50914" />
          <rect x="12" y="16" width="6" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
        </svg>
      );

    case 'prototyping':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="3" stroke="#E50914" />
          <circle cx="18" cy="18" r="3" stroke="#27C93F" />
          <path d="M9 6h4a5 5 0 0 1 5 5v4" stroke="#E50914" strokeWidth="2" strokeLinecap="round" />
          <polygon points="18,14 16,11 20,11" fill="#E50914" />
        </svg>
      );

    case 'adobepremierepro':
    case 'premierepro':
    case 'pr':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#00005B" />
          <rect width="24" height="24" rx="4" stroke="#9999FF" strokeWidth="1.5" />
          <text x="7" y="17" fontSize="11" fontWeight="800" fill="#9999FF" fontFamily="sans-serif">Pr</text>
        </svg>
      );

    case 'adobeaftereffects':
    case 'aftereffects':
    case 'ae':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#00005B" />
          <rect width="24" height="24" rx="4" stroke="#D291FF" strokeWidth="1.5" />
          <text x="6" y="17" fontSize="11" fontWeight="800" fill="#D291FF" fontFamily="sans-serif">Ae</text>
        </svg>
      );

    case 'contentcreation':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="4" width="20" height="16" rx="3" stroke="#E50914" />
          <path d="M7 4v16" stroke="#E50914" />
          <path d="M17 4v16" stroke="#E50914" />
          <line x1="2" y1="9" x2="7" y2="9" stroke="#E50914" />
          <line x1="2" y1="15" x2="7" y2="15" stroke="#E50914" />
          <line x1="17" y1="9" x2="22" y2="9" stroke="#E50914" />
          <line x1="17" y1="15" x2="22" y2="15" stroke="#E50914" />
          <polygon points="10,9 15,12 10,15" fill="#FFFFFF" stroke="none" />
        </svg>
      );

    case 'vercel':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L24 22H0L12 1Z" fill="#FFFFFF" />
        </svg>
      );

    case 'netlify':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M6.5 12L12 6.5l5.5 5.5-2.5 6h-6l-2.5-6z"
            fill="#00C7B7"
          />
          <path
            d="M12 2l7 7-3 8-4 5-4-5-3-8 7-7z"
            stroke="#00C7B7"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );

    // 05 — Mobile Development
    case 'flutter':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M14.3 2L4 12.3l3.2 3.2L19.5 3.2h-5.2z" fill="#54C5F8" />
          <path d="M14.3 12.8L8.6 18.5l3.2 3.2 5.7-5.7 3.8-3.2h-7z" fill="#29B6F6" />
          <path d="M11.8 15.3l2.5-2.5h5.2l-5.7 5.7-2-3.2z" fill="#01579B" />
        </svg>
      );

    case 'dart':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 4l9.5 2.5L20 14l-4 6-12-6V4z" fill="#0175C2" />
          <path d="M13.5 6.5L20 14l-4 6-7.5-2 1.5-8 3.5-3.5z" fill="#02569B" />
          <path d="M4 4l9.5 2.5-3.5 3.5L4 11V4z" fill="#29B6F6" />
          <path d="M10 10l-6 1v3l6 5.5 3.5-2.5-3.5-7z" fill="#00B4AB" />
        </svg>
      );

    default:
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" stroke="#E50914" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="#FFFFFF" />
          <circle cx="12" cy="16" r="1" fill="#FFFFFF" />
        </svg>
      );
  }
}
