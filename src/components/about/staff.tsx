'use client';

import { useState, useEffect } from 'react';
import { Staff as StaffType } from '@/lib/schema';
import { User } from 'lucide-react';

export function Staff() {
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [loading, setLoading] = useState(true);

  function getObjectPositionFromFocalPoint(raw?: unknown): string {
    if (!raw) return 'center';
    try {
      // Aggressively unwrap deeply escaped/encoded JSON strings
      let parsed: any = raw;
      for (let i = 0; i < 8 && typeof parsed === 'string'; i++) {
        const trimmed = parsed.trim();
        const unquoted = trimmed.startsWith('"') && trimmed.endsWith('"')
          ? trimmed.slice(1, -1)
          : trimmed;
        const deescaped = unquoted.replace(/\\\"/g, '"');
        try {
          parsed = JSON.parse(deescaped);
          continue;
        } catch {
          // If still not JSON parseable, keep trying in next iteration
          parsed = deescaped;
        }
      }
      // Extract x/y whether object or string
      let xVal: number | undefined;
      let yVal: number | undefined;
      if (parsed && typeof parsed === 'object') {
        xVal = typeof (parsed as any).x === 'string' ? Number((parsed as any).x) : Number((parsed as any).x);
        yVal = typeof (parsed as any).y === 'string' ? Number((parsed as any).y) : Number((parsed as any).y);
      } else if (typeof parsed === 'string') {
        const s = parsed;
        const sx = /\"?x\"?\s*:\s*([0-9]+(?:\.[0-9]+)?)/.exec(s) || /x\s*:\s*([0-9]+(?:\.[0-9]+)?)/.exec(s);
        const sy = /\"?y\"?\s*:\s*([0-9]+(?:\.[0-9]+)?)/.exec(s) || /y\s*:\s*([0-9]+(?:\.[0-9]+)?)/.exec(s);
        if (sx) xVal = Number(sx[1]);
        if (sy) yVal = Number(sy[1]);
      }
      if (Number.isFinite(xVal) && Number.isFinite(yVal)) {
        // Standard focal-point technique: use stored X/Y directly with background-size: cover
        const nxRaw = (xVal as number) <= 1 && (xVal as number) >= 0 ? (xVal as number) * 100 : (xVal as number);
        const nyRaw = (yVal as number) <= 1 && (yVal as number) >= 0 ? (yVal as number) * 100 : (yVal as number);
        const clamp = (v: number) => Math.max(0, Math.min(100, v));
        const nx = clamp(nxRaw);
        const ny = clamp(nyRaw);
        return `${nx}% ${ny}%`;
      }
      return 'center';
    } catch {
      return 'center';
    }
  }

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
      <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-serif">Our Staff</h2>
            <p className="mt-4 text-lg text-white">Meet the people who help make our church community thrive</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-serif">Our Staff</h2>
          <p className="mt-4 text-lg text-white">Meet the people who help make our church community thrive</p>
        </div>

        <div className="space-y-12">
          {staff.map((person, index) => {
            // Cycle through signature colors for separators
            const colors = [
              { bg: 'red-600', hex: '#dc2626' },
              { bg: 'teal-800', hex: '#115e59' },
              { bg: 'indigo-900', hex: '#312e81' },
              { bg: 'amber-500', hex: '#f59e0b' },
              { bg: 'lime-700', hex: '#4d7c0f' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
              <div key={person.id}>
                <div className="flex flex-col md:flex-row items-start gap-6 max-w-2xl mx-auto">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {person.imageUrl ? (
                      (() => {
                        const objPos = getObjectPositionFromFocalPoint(person.focalPoint);
                        return (
                          <div
                            aria-label={person.name}
                            className="rounded-full shadow-lg"
                            style={{
                              width: '192px',
                              height: '192px',
                              backgroundImage: `url(${person.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: objPos,
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                        );
                      })()
                    ) : (
                      <div 
                        className="bg-gray-200 rounded-full flex items-center justify-center shadow-lg"
                        style={{ width: '192px', height: '192px' }}
                      >
                        <User className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-3">
                      <div className="px-4 py-3 rounded-lg w-full" style={{ backgroundColor: colorScheme.hex }}>
                        <h3 className="text-xl md:text-2xl font-semibold text-white font-serif mb-1">
                          {person.name}
                        </h3>
                        <p className="text-white font-medium text-base md:text-lg">
                          {person.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-white leading-relaxed mb-3">{person.bio}</p>
                    {person.email && (
                      <a 
                        href={`mailto:${person.email}`}
                        className="inline-flex items-center text-white hover:text-white/80 font-medium transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {person.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
