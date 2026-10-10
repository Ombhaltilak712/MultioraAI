import Badge from './Badge';
import GradientText from './GradientText';

export default function SectionHeading({
  eyebrow,
  title,
  gradientWords = [],
  description,
  align = 'center',
  className = ''
}) {
  const isCentered = align === 'center';

  const renderTitle = () => {
    if (typeof title !== 'string' || gradientWords.length === 0) {
      return title;
    }

    const regex = new RegExp(`(${gradientWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = title.split(regex);

    return parts.map((part, index) => {
      const match = gradientWords.some((gw) => gw.toLowerCase() === part.toLowerCase());
      if (match) {
        return (
          <GradientText key={index} animate>
            {part}
          </GradientText>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex flex-col gap-3.5 ${
        isCentered ? 'items-center text-center mx-auto max-w-3xl' : 'items-start text-left max-w-2xl'
      } ${className}`}
    >
      {eyebrow && (
        <Badge variant="gradient" dot ping size="md" className="shadow-[0_0_20px_rgba(99,102,241,0.25)]">
          {eyebrow}
        </Badge>
      )}

      {title && (
        <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 tracking-tight leading-[1.12]">
          {renderTitle()}
        </h2>
      )}

      {description && (
        <p className="text-sm sm:text-base md:text-lg text-slate-400 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
