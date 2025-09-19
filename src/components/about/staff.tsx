'use client';

import { useState, useEffect } from 'react';
import { Staff as StaffType } from '@/lib/schema';

export function Staff() {
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/admin/staff');
        if (response.ok) {
          const data = await response.json();
          setStaff(data.staff);
        }
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Our Staff</h2>
            <p className="mt-4 text-lg text-gray-600">Meet the people who help make our church community thrive</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Our Staff</h2>
          <p className="mt-4 text-lg text-gray-600">Meet the people who help make our church community thrive</p>
        </div>

        <div className="space-y-12">
          {staff.map((person) => (
            <div key={person.id} className="flex flex-col md:flex-row items-start gap-6 max-w-2xl mx-auto">
              {/* Photo */}
              <div className="flex-shrink-0">
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="rounded-full object-cover shadow-lg"
                    style={{
                      width: '192px',
                      height: '192px',
                      objectPosition: person.focalPoint ? 
                        (() => {
                          try {
                            const focal = JSON.parse(person.focalPoint);
                            return `${focal.x}% ${focal.y}%`;
                          } catch {
                            return 'center';
                          }
                        })() : 'center'
                    }}
                  />
                ) : (
                  <div 
                    className="bg-gray-200 rounded-full flex items-center justify-center shadow-lg"
                    style={{ width: '192px', height: '192px' }}
                  >
                    <span className="text-4xl text-gray-400">👤</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 font-serif mb-2">{person.name}</h3>
                <p className="text-blue-600 font-medium text-base md:text-lg mb-3">{person.title}</p>
                <p className="text-gray-600 leading-relaxed mb-3">{person.bio}</p>
                {person.email && (
                  <a 
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {person.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
