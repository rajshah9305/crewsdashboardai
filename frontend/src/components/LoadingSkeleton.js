const LoadingSkeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  variant = 'default' 
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] rounded';
  
  const variants = {
    default: 'bg-neutral-200',
    card: 'bg-neutral-100 rounded-lg',
    text: 'bg-neutral-200 rounded',
    avatar: 'bg-neutral-200 rounded-full',
    button: 'bg-neutral-200 rounded-lg'
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${width} ${height} ${className}`}
      style={{
        animation: 'shimmer 2s infinite linear'
      }}
    />
  );
};

// Predefined skeleton components
export const CardSkeleton = ({ className = '' }) => (
  <div className={`card p-6 ${className}`}>
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton variant="avatar" width="w-10" height="h-10" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton width="w-1/3" height="h-4" />
          <LoadingSkeleton width="w-1/2" height="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton width="w-full" height="h-3" />
        <LoadingSkeleton width="w-4/5" height="h-3" />
        <LoadingSkeleton width="w-3/5" height="h-3" />
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({ items = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-neutral-200">
        <LoadingSkeleton variant="avatar" width="w-8" height="h-8" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton width="w-1/4" height="h-4" />
          <LoadingSkeleton width="w-3/4" height="h-3" />
        </div>
        <LoadingSkeleton width="w-16" height="h-6" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg border border-neutral-200 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="border-b border-neutral-200 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <LoadingSkeleton key={index} width="w-20" height="h-4" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-neutral-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <LoadingSkeleton 
                key={colIndex} 
                width={colIndex === 0 ? "w-24" : "w-16"} 
                height="h-4" 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <LoadingSkeleton variant="avatar" width="w-10" height="h-10" />
            <LoadingSkeleton width="w-12" height="h-6" />
          </div>
          <LoadingSkeleton width="w-16" height="h-8" className="mb-2" />
          <LoadingSkeleton width="w-20" height="h-4" />
        </div>
      ))}
    </div>
    
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

export default LoadingSkeleton;