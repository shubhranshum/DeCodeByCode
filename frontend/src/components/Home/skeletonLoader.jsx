const SkeletonLoader = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    ))}
  </div>
);
export default SkeletonLoader;