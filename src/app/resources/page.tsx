export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Resources</h1>
          <p className="text-xl text-gray-600">Helpful resources for your faith journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sermon Series */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sermon Series</h3>
            <p className="text-gray-600 mb-4">
              Explore our current and past sermon series for spiritual growth and reflection.
            </p>
            <a 
              href="/sermon-series" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Series →
            </a>
          </div>

          {/* Seasonal Guides */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seasonal Guides</h3>
            <p className="text-gray-600 mb-4">
              Resources and guides for holidays and special seasons throughout the year.
            </p>
            <a 
              href="/seasonal-guides" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Guides →
            </a>
          </div>

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

          {/* Ministries */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ministries</h3>
            <p className="text-gray-600 mb-4">
              Discover opportunities to serve and get involved in our church community.
            </p>
            <a 
              href="/ministry-database" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore Ministries →
            </a>
          </div>

          {/* Visit Information */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Plan Your Visit</h3>
            <p className="text-gray-600 mb-4">
              Everything you need to know about visiting First Christian Church for the first time.
            </p>
            <a 
              href="/visit" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit Information →
            </a>
          </div>

          {/* Giving */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Give</h3>
            <p className="text-gray-600 mb-4">
              Support our mission and ministries through online giving and stewardship.
            </p>
            <a 
              href="/give" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Give Online →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
