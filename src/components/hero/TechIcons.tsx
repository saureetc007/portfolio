interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function TechIcon({ name, className = 'tech-icon', size = 18 }: IconProps) {
  switch (name.toLowerCase()) {
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

    case 'react':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.4" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );

    case 'typescript':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <path d="M4 10h6m-3 0v9m5-7.5c.8-.7 1.8-1 3-1 2.2 0 3.5 1.1 3.5 2.8 0 2.8-4.5 2.6-4.5 4.7 0 .8.7 1.2 1.8 1.2 1.4 0 2.5-.5 3.2-1.3l.8 1.6c-.9 1-2.4 1.5-4.2 1.5-2.6 0-4-1.3-4-3 0-3 4.5-2.8 4.5-4.8 0-.7-.6-1.1-1.6-1.1-1.1 0-2.1.4-2.8 1l-.7-1.6Z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'javascript':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path d="M7 16.5c.5.8 1.2 1.3 2.2 1.3 1.2 0 2-.8 2-2.5V8h2.3v7.3c0 3-1.8 4.5-4.3 4.5-2 0-3.3-1-3.9-2.3l1.7-1Zm8.2-1.2c.7.8 1.7 1.3 2.8 1.3 1.2 0 2-.6 2-1.5 0-1-1-1.5-2.6-2-2.2-.7-3.7-1.6-3.7-3.7 0-2.1 1.6-3.6 4.1-3.6 1.8 0 3 .6 3.8 1.8l-1.8 1.2c-.5-.7-1.1-1-2-1-.9 0-1.6.5-1.6 1.2 0 .9.8 1.3 2.3 1.8 2.5.8 4 1.7 4 3.9 0 2.3-1.8 3.8-4.5 3.8-2.3 0-3.8-.9-4.6-2.3l1.7-1.5Z" fill="#000000" />
        </svg>
      );

    case 'git':
    case 'github':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
        </svg>
      );

    case 'sqlite':
    case 'sql':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );

    case 'numpy':
    case 'pandas':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#013243" stroke="#4dabf7" strokeWidth="1.2" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#013243" stroke="#4dabf7" strokeWidth="1.2" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#013243" stroke="#4dabf7" strokeWidth="1.2" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#E50914" stroke="#ff6b6b" strokeWidth="1.2" />
        </svg>
      );

    case 'threejs':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 8.5 12 15 22 8.5 12 2" />
          <polygon points="2 15.5 12 22 22 15.5" />
          <line x1="12" y1="22" x2="12" y2="15" />
        </svg>
      );

    case 'html-css':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" stroke="#E50914" />
        </svg>
      );

    case 'vscode':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.4 2.1a1.2 1.2 0 0 0-1.1.3l-8.6 7.4L4.3 7.2a.8.8 0 0 0-1.1.2L2.1 8.7a.8.8 0 0 0 .1 1.1l4.4 3.7-4.4 3.7a.8.8 0 0 0-.1 1.1l1.1 1.3a.8.8 0 0 0 1.1.2l3.4-2.6 8.6 7.4c.3.3.8.4 1.1.3a1.2 1.2 0 0 0 .7-1.1V3.2a1.2 1.2 0 0 0-.7-1.1ZM16 17.6l-5.6-4.6 5.6-4.6v9.2Z" fill="#007ACC" />
        </svg>
      );

    case 'ollama':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a8 8 0 0 0-8 8c0 3.2 1.9 6 4.7 7.3L8 22h8l-.7-4.7A8 8 0 0 0 20 10a8 8 0 0 0-8-8Z" stroke="#E50914" />
          <circle cx="9" cy="10" r="1" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="1" fill="#FFFFFF" />
        </svg>
      );

    default:
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
  }
}
