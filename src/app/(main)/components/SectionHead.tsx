interface SectionHeadProps {
  num: string;
  title: string;
  em: string;
  note: string;
}

export function SectionHead({ num, title, em, note }: SectionHeadProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 items-baseline mb-10 md:mb-12">
      <div className="font-mono font-bold leading-none tracking-[-0.04em] text-lime text-[length:var(--text-sec-num)]">
        {num}
      </div>
      <h2 className="font-medium leading-none tracking-[-0.035em] whitespace-nowrap text-[length:var(--text-sec-title)]">
        {title}{" "}
        <em className="font-serif-it italic font-normal text-lime text-[1.05em]">
          {em}
        </em>
      </h2>
      <div className="hidden md:block text-right text-xs font-mono text-site-muted">
        {note}
      </div>
    </div>
  );
}
