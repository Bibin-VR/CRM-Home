interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalizedStatus = status.replace(/\s/g, "_");
  return (
    <span className={`brutalist-badge status-${normalizedStatus} ${className}`}>
      {status}
    </span>
  );
}
