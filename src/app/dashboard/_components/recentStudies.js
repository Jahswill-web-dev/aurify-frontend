import React from 'react';
import { motion } from 'framer-motion';

const studies = [
  {
    id: 1,
    title: 'Math - Calculus',
    subject: 'Mathematics',
    createdOn: '2023-08-15',
    image: 'https://images.pexels.com/photos/6256/mathematics-blackboard-education-classroom.jpg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-teal-600 to-teal-700'
  },
  {
    id: 2,
    title: 'Science - Biology',
    subject: 'Biology',
    createdOn: '2023-08-10',
    image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-teal-600 to-teal-700'
  },
  {
    id: 3,
    title: 'History - World War II',
    subject: 'History',
    createdOn: '2023-08-05',
    image: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 4,
    title: 'English - Shakespeare',
    subject: 'Literature',
    createdOn: '2023-07-30',
    image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-orange-100 to-orange-200'
  },
];

export const RecentStudies = () => {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900"
      >
        Coming soon...
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studies.map((study, index) => (
          <motion.div
            key={study.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
          >
            {/* Image/Visual */}
            <div className={`h-48 bg-gradient-to-br ${study.color} relative overflow-hidden`}>
              {study.id === 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/80 text-6xl font-light">∫</div>
                  <div className="absolute top-4 left-4 text-white/60 text-sm">f(x) = x²+2x+1</div>
                  <div className="absolute bottom-4 right-4 text-white/60 text-xs">dx</div>
                </div>
              )}
              {study.id === 2 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-white/60 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-white/80 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/90 rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white/80 text-xs">BIOLOGY</div>
                </div>
              )}
              {study.id === 3 && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${study.image})` }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              )}
              {study.id === 4 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-24 h-32 bg-cover bg-center rounded-lg shadow-lg"
                    style={{ backgroundImage: `url(${study.image})` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{study.title}</h3>
              <p className="text-sm text-blue-600 mb-2">Created on {study.createdOn}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};