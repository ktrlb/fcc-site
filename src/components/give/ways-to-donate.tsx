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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Ways to Donate</h2>
          <p className="mt-4 text-lg text-gray-600">Choose the method that works best for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {donationMethods.map((method, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-serif">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  
                  {method.address && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 font-medium">Address:</p>
                      <p className="text-sm text-gray-600">{method.address}</p>
                    </div>
                  )}
                  
                  {method.details && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">{method.details}</p>
                    </div>
                  )}
                  
                  {method.isExternal && (
                    <Button asChild className="w-full">
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
          ))}
        </div>
      </div>
    </section>
  );
}
