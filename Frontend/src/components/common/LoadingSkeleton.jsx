import { motion } from "framer-motion";

export const SkeletonCard = () => (
  <div className="card p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="card p-6">
    <div className="animate-pulse space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <motion.div className="card p-6">
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </motion.div>
);

export const SkeletonChart = () => (
  <div className="card p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

