import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const StatsSection = ({ stats }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const statItems = [
    { label: "Problems Solved", value: stats.problemsSolved },
    { label: "Blog Posts", value: stats.blogCount },
    { label: "Blog Views", value: stats.blogViews },
    { label: "Solutions Accepted", value: stats.solutionsAccepted },
  ];

  return (
    <div 
      ref={ref}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-lg p-6 transition-all hover:shadow-2xl dark:hover:shadow-xl hover:-translate-y-1 duration-300"
    >
      <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 pb-2 border-b border-indigo-100 dark:border-gray-700">
        Statistics
      </h2>
      
      <div className="space-y-5">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex justify-between items-center p-4 bg-indigo-50/40 dark:bg-gray-700/30 rounded-lg transition-all hover:bg-indigo-100/50 dark:hover:bg-gray-600/30"
            initial="hidden"
            animate={controls}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4,
                  delay: index * 0.15,
                  ease: "easeOut"
                }
              },
              hidden: { opacity: 0, y: 20 }
            }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
              <span className="text-slate-700 dark:text-gray-300 font-medium">
                {item.label}
              </span>
            </div>
            
            <motion.span 
              className="font-bold text-indigo-700 dark:text-indigo-300 text-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 15,
                delay: 0.3 + (index * 0.15)
              }}
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-gray-700">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsSection;