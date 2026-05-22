
const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    {/* Icon - Rounded square with L */}
    
    <image href="/icon.svg" x="5" y="5" width="40" height="40" />

    {/* "letter" text */}
    <text
      x="50"
      y="25"
      fontSize="24"
      fontWeight="600"
      fill="currentColor"
      dominantBaseline="middle"
      fontFamily="Arial, sans-serif"
    >
      letter
    </text>

    {/* "flow" text in green */}
    <text
      x="110"
      y="25"
      fontSize="24"
      fontWeight="600"
      fill="#5ECA4E"
      dominantBaseline="middle"
      fontFamily="Arial, sans-serif"
    >
      flow
    </text>
  </svg>
);

// Compact icon-only logo
const CompactLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <image href="/icon.svg" x="0" y="0" width="50" height="50" />
  </svg>
);

export default Logo;
export { CompactLogo };
