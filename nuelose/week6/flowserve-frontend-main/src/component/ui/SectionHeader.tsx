import type { SectionHeaderProps } from "../../types/type";


function SectionHeader({title, subtitle, children}:SectionHeaderProps) {
    return (
      <header className="flex justify-between mb-8">
        <div className="space-y-0 leading-tight">
          <h2 className="text-2xl font-semibold mb-0">{title}</h2>
          <p>{subtitle}</p>
        </div>

        {children && <div>{children}</div>}
      </header>
    );
}

export default SectionHeader