export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Resources</h1>
          <p className="text-xl text-gray-600">Helpful resources for your faith journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Church Calendar</h3>
            <p className="text-gray-600 mb-4">
              Stay up to date with all church events, services, and special programs.
            </p>
            <a 
              href="/calendar" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Calendar →
            </a>
          </div>

          {/* La Reunión */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">La Reunión</h3>
            <p className="text-gray-600 mb-4">
              Connect with our Spanish-speaking ministry and community.
            </p>
            <a 
              href="https://www.la-reunion.org" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit La Reunión →
            </a>
          </div>

          {/* FCC Library */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">FCC Library</h3>
            <p className="text-gray-600 mb-4">
              Explore our collection of books and resources to support your faith journey.
            </p>
            <a 
              href="/library" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit Library →
            </a>
          </div>

          {/* Church Directory */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Church Directory</h3>
            <p className="text-gray-600 mb-4">
              Access our church family directory with contact information for members.
            </p>
            <a 
              href="/directory" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Directory →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
