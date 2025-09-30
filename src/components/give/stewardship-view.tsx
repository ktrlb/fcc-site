export function StewardshipView() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-900 font-serif">Our View on Stewardship</h2>
          <p className="mt-4 text-lg text-indigo-700">Understanding our approach to giving and discipleship</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <div className="prose prose-xl max-w-none">
              <p className="text-white leading-relaxed mb-6 text-xl">
                Every year (usually in October) we have a stewardship campaign. This is a time we challenge 
                each person in our church to assess where they are in the 5 areas of discipleship 
                (Prayer, Study, Service, Presence & Generosity).
              </p>
              
              <p className="text-white leading-relaxed mb-6 text-xl">
                Each of these is an opportunity to give: of our time, our love, and our financial resources. 
                Part of this season is filling out an annual pledge card. If you missed submitting your pledge 
                in October, it&apos;s never too late. There are some physical cards in the Narthex of the church, 
                or you can pledge online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
