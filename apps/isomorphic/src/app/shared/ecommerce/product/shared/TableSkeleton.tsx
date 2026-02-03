import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ 
  rows = 5, 
  columns = 6 
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-muted last:border-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
