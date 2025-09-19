export default function SermonSeriesPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Sermon Series</h1>
          <p className="text-xl text-gray-600">Explore our current and past sermon series</p>
        </div>

        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600">
                We&apos;re working on bringing you our sermon series archive. 
                Check back soon for access to our past teachings and current series.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
