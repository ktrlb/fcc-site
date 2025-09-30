import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Mail, Gift } from "lucide-react";

export function WaysToDonate() {
  const donationMethods = [
    {
      title: "Online Donation",
      description: "Make a secure donation online through our giving platform",
      icon: CreditCard,
      action: "Donate Online",
      link: "https://app.aplos.com/aws/give/fccgranbury/donate",
      isExternal: true
    },
    {
      title: "Send by Mail",
      description: "Send your donation to our locked mailbox",
      icon: Mail,
      action: "View Address",
      address: "2109 W US Hwy 377, Granbury, TX 76048",
      isExternal: false
    },
    {
      title: "Offering Box",
      description: "Use the offering box in our Sanctuary when the church office is open",
      icon: Gift,
      action: "Learn More",
      details: "Our Sanctuary is available to you when the church office is open. You can use the offering box anytime.",
      isExternal: false
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-serif">Ways to Donate</h2>
          <p className="mt-4 text-lg text-white/80">Choose the method that works best for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {donationMethods.map((method, index) => {
            const colorSchemes = [
              { bg: 'rgb(220 38 38)', name: 'red-600' },      // Online Donation - Red
              { bg: 'rgb(17 94 89)', name: 'teal-800' },      // Send by Mail - Teal
              { bg: 'rgb(49 46 129)', name: 'indigo-900' }    // Offering Box - Indigo
            ];
            const colorScheme = colorSchemes[index];
            
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: colorScheme.bg }}>
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-8 w-8" style={{ color: colorScheme.bg }} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 font-serif">
                      {method.title}
                    </h3>
                    
                    <p className="text-white/90 mb-4 leading-relaxed">
                      {method.description}
                    </p>
                  
                  {method.address && (
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-base text-white font-medium">Address:</p>
                      <p className="text-base text-white/80">{method.address}</p>
                    </div>
                  )}
                  
                  {method.details && (
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-base text-white/80">{method.details}</p>
                    </div>
                  )}
                  
                  {method.isExternal && (
                    <Button asChild className="w-full bg-white text-red-600 hover:bg-white/10 hover:text-white border border-white transition-colors">
                      <a 
                        href={method.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        {method.action}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
