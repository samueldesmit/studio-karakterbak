export default function LogoSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/logo.svg"
      alt="Studio Karakterbak"
      className={className}
      style={style}
    />
  );
}
