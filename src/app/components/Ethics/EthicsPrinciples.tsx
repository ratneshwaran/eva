'use client';

import { FaUserShield, FaHeart, FaClipboardCheck, FaHandshake, FaBalanceScale, FaLeaf } from 'react-icons/fa';

export default function EthicsPrinciples() {
  const principles = [
    {
      title: "Protect autonomy",
      description: "We respect your right to make independent decisions. Eva is designed to support, not direct, your mental health journey.",
      icon: <FaUserShield className="w-12 h-12 text-indigo-600" />
    },
    {
      title: "Promote human well-being, safety and the public interest",
      description: "Your well-being and safety are our top priorities. We provide evidence-based support and clear guidance for emergency situations.",
      icon: <FaHeart className="w-12 h-12 text-amber-500" />
    },
    {
      title: "Ensure transparency, explainability and intelligibility",
      description: "Eva clearly communicates her capabilities and limitations. We're transparent about AI's role in your mental health support.",
      icon: <FaClipboardCheck className="w-12 h-12 text-indigo-600" />
    },
    {
      title: "Foster responsibility and accountability",
      description: "We maintain high standards of responsibility in our AI development and are accountable for Eva's interactions and recommendations.",
      icon: <FaBalanceScale className="w-12 h-12 text-amber-500" />
    },
    {
      title: "Ensure inclusiveness and equity",
      description: "Eva is designed to be accessible and helpful to everyone, regardless of their background, culture, or circumstances.",
      icon: <FaHandshake className="w-12 h-12 text-indigo-600" />
    },
    {
      title: "Promote AI that is responsive and sustainable",
      description: "We continuously improve Eva's capabilities while ensuring sustainable and responsible AI development practices.",
      icon: <FaLeaf className="w-12 h-12 text-amber-500" />
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Ethics & Transparency Principles</h1>
          <p className="text-xl text-gray-600">
            Eva is built on a foundation of ethical principles that prioritize transparency, safety, and your well-being.
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency About Eva</h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">Eva is an artificial intelligence system designed to provide mental health support. Here's what you should know:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-3 text-blue-700">What Eva Can Do</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Listen and respond with empathy</li>
                  <li>Suggest evidence-based coping strategies</li>
                  <li>Provide information about mental health</li>
                  <li>Guide breathing exercises</li>
                  <li>Direct you to professional resources</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-3 text-red-700">What Eva Cannot Do</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide medical or professional advice</li>
                  <li>Diagnose mental health conditions</li>
                  <li>Prescribe medications</li>
                  <li>Replace human therapists or counselors</li>
                  <li>Handle emergency situations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {principle.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {principle.title}
                </h2>
                <p className="text-gray-600">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How Eva Works</h3>
          <div className="space-y-4 text-gray-700">
            <p>Eva uses advanced language AI technology to understand and respond to your messages. Here's how it works:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Eva processes your messages to understand their meaning and context</li>
              <li>Responses are generated based on training data and established mental health support practices</li>
              <li>Eva maintains conversation history during your session to provide contextual responses</li>
              <li>All interactions are confidential and handled according to strict privacy standards</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Transparency</h3>
          <p className="text-lg text-gray-700">
            We believe in being completely open about Eva's capabilities and limitations. We regularly update our systems and documentation to reflect any changes in Eva's abilities. If you ever feel uncertain about any aspect of your interaction with Eva, we encourage you to ask questions or seek clarification.
          </p>
        </div>
      </div>
    </div>
  );
} 