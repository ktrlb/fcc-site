export function GivingInfo() {
  return (
    <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-serif">On Giving</h2>
          <p className="mt-4 text-lg text-white/80">How your generosity makes a difference</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <div className="prose prose-lg max-w-none">
              <p className="text-white leading-relaxed mb-6">
                <strong>11% of monies received by the congregation are distributed through our outreach 
                partnerships and community.</strong> We have many opportunities for sharing of time and talent.
              </p>
              
              <p className="text-white leading-relaxed">
                In addition to the generosity of our treasure, our time and talent are also valued. 
                Please see the seasonal guide on our home page to see a variety of ways you can share your gifts.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-stone-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-indigo-900 font-serif mb-4">
              Thank You for Your Generosity
            </h3>
            <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
              Your generosity helps us continue our mission of sharing God&apos;s love with all people. 
              Every gift, no matter the size, makes a meaningful impact in our community.
            </p>
            <a 
              href="https://app.aplos.com/aws/give/fccgranbury/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-indigo-900 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors font-semibold"
            >
              Donate Online Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
