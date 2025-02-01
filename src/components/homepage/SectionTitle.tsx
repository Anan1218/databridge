interface SectionTitleProps {
  preTitle?: string;
  title: string;
  children?: React.ReactNode;
}

export function SectionTitle({ preTitle, title, children }: SectionTitleProps) {
  return (
    <div className="text-center py-20">
      {preTitle && (
        <p className="text-[#8b5cf6] uppercase tracking-wide mb-4 font-medium">
          {preTitle}
        </p>
      )}
      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#8b5cf6] to-[#6366F1] text-transparent bg-clip-text">
        {title}
      </h2>
      {children && <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{children}</p>}
    </div>
  );
} 