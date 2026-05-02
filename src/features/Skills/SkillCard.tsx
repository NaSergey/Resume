"use client";

export type SkillGroup = {
  category: string;
  color:    string;
  rawColor: string;
  skills:   { name: string; level: number }[];
};

interface SkillCardProps {
  group:        SkillGroup;
  groupIndex:   number;
  onMouseMove:  (e: React.MouseEvent<HTMLDivElement>, i: number) => void;
  onMouseLeave: () => void;
}

export function SkillCard({ group, groupIndex, onMouseMove, onMouseLeave }: SkillCardProps) {
  return (
    <div
      className="skill-group opacity-0 glass-hi clip-corner p-4 md:p-6 noise basis-full shrink-0 md:basis-auto md:shrink"
      data-cursor-hover
      onMouseMove={(e) => onMouseMove(e, groupIndex)}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: group.color, boxShadow: `0 0 10px ${group.rawColor}80` }}
        />
        <span
          className="font-mono text-[12px] tracking-[0.2em] uppercase"
          style={{ color: group.color }}
        >
          {group.category}
        </span>
      </div>

      <div className="space-y-3 md:space-y-5">
        {group.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-sans text-sm" style={{ color: "var(--color-ink-dim)" }}>
                {skill.name}
              </span>
              <span className="skill-level-label font-mono text-label" style={{ color: group.color, opacity: 0.7 }}>
                0%
              </span>
            </div>
            <div
              className="relative overflow-visible"
              style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="skill-bar-fill absolute inset-y-0 left-0 right-0"
                data-level={skill.level}
                style={{
                  transformOrigin: "left center",
                  background: `linear-gradient(90deg, ${group.color}, ${group.rawColor}88)`,
                  boxShadow: `0 0 8px ${group.rawColor}55`,
                  height: "1px",
                }}
              />
              <div
                className="skill-bar-dot absolute"
                style={{
                  left: `${skill.level}%`,
                  top: "50%",
                  width: "8px", height: "8px",
                  borderRadius: "50%",
                  background: group.color,
                  boxShadow: `0 0 12px ${group.rawColor}, 0 0 24px ${group.rawColor}60`,
                  transform: "translate(-50%, -50%) scale(0)",
                  transformOrigin: "center",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
