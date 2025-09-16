import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Car, Accessibility, Users, Heart, Baby, Shirt, Mail } from "lucide-react";

export function WhatToExpect() {
  const faqs = [
    {
      question: "What's the Parking Situation?",
      icon: Car,
      answer: "As you pull into our parking lot, either a right hand turn or a left hand turn will lead you to a parking space. Both main entrances to our church (on the right and the left sides) are under big car ports. Once you're inside, you should see a greeter who will help you find your way around our facility (Look for someone with a yellow name tag! They're our \"Welcome Team\" and should be able to help)."
    },
    {
      question: "Is FCC Handicap Accessible?",
      icon: Accessibility,
      answer: "Handicap parking and accessibility to our sanctuary is available at both entrances near the carports. We have wheelchair accessibility among our pews, and hearing aid devices are available for guests who might be hearing impaired."
    },
    {
      question: "What Are The People Like?",
      icon: Users,
      answer: "Our people are white collar and blue collar, young and old, conservative and liberal. We believe that being a community committed to following the teachings of Jesus is more important than agreeing on all of the particulars of faith. You'll find people from all kinds of viewpoints and all kinds of backgrounds at our church. That's the way we like it!"
    },
    {
      question: "What's The Vibe Like?",
      icon: Heart,
      answer: "FCC Granbury is a pretty laid-back place. We're serious about our faith, but we seriously believe that a life of faith is meant to be joyful and authentic. We want you to come as you are, and share with us the beautiful piece of God that is in you."
    },
    {
      question: "Will I Feel Welcome?",
      icon: HelpCircle,
      answer: "It's very important to us that you do. The people of our church want everyone to feel welcome here, and we try our best to connect with everyone that comes through our doors. Of course, the more you stick around, introduce yourself, and get involved, the more likely you are to connect."
    },
    {
      question: "Is This Church a Friendly Place for Kids?",
      icon: Baby,
      answer: "You bet! FCC Granbury is dedicated to fostering the faith of our children and youth, and to providing meaningful spiritual opportunities for families. On Sundays, our staffed Nursery and Primary Room are available for kids up to age 7 if parents want to attend worship or Sunday School kid-free. We also have a \"prayground\" available in the gathering area with things to keep kids entertained."
    },
    {
      question: "What Will People Be Wearing?",
      icon: Shirt,
      answer: "Your guess is as good as ours! Some of us feel most comfortable worshipping God in a dress or suit and tie. Others prefer to worship in shorts or jeans. Whatever you choose to wear, you'll probably be able to find someone who is dressed similarly to you."
    },
    {
      question: "If I Visit, Will I Get 10,000 emails and phone calls?",
      icon: Mail,
      answer: "No. You will get a follow up phone call or note IF you choose to give us your address or phone number. You will not get more contact than you desire. We do promise that you will get noticed and welcomed, even if you only choose to worship with us once. You matter to us and to God."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">What To Expect</h2>
          <p className="mt-4 text-lg text-gray-600">Common questions from first-time visitors</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <faq.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We&apos;d love to answer any other questions you might have. 
              Feel free to reach out to us or just come visit - we&apos;re here to help!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                <p className="text-sm text-gray-600">(817) 573-5433</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                <p className="text-sm text-gray-600">office@fccgranbury.org</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                <p className="text-sm text-gray-600">Monday-Thursday<br />9am-5pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
