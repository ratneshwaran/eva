// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

'use client';

interface Resource {
  name: string;
  description: string;
  contact?: string;
  website?: string;
  available: string;
  category: 'emergency' | 'crisis' | 'support';
}

const RESOURCES: Resource[] = [
  {
    name: 'Samaritans',
    description: '24/7 listening support for anyone in emotional distress',
    contact: '116 123',
    website: 'https://www.samaritans.org',
    available: '24/7',
    category: 'emergency'
  },
  {
    name: 'NHS Mental Health Crisis Line',
    description: 'Immediate support from NHS mental health professionals',
    contact: '111, then select option 2',
    website: 'https://www.nhs.uk/service-search/mental-health/find-an-urgent-mental-health-helpline',
    available: '24/7',
    category: 'emergency'
  },
  {
    name: 'Mind',
    description: 'Mental health support and guidance',
    contact: '0300 123 3393',
    website: 'https://www.mind.org.uk',
    available: 'Mon-Fri 9am-6pm',
    category: 'support'
  },
  {
    name: 'CALM (Campaign Against Living Miserably)',
    description: 'Support for men feeling down or in crisis',
    contact: '0800 58 58 58',
    website: 'https://www.thecalmzone.net',
    available: '5pm-midnight',
    category: 'crisis'
  },
  {
    name: 'Young Minds',
    description: 'Mental health support for young people',
    contact: 'Text YM to 85258',
    website: 'https://www.youngminds.org.uk',
    available: '24/7',
    category: 'support'
  },
  {
    name: 'Papyrus HOPELINEUK',
    description: 'Prevention of young suicide',
    contact: '0800 068 4141',
    website: 'https://www.papyrus-uk.org',
    available: '9am-midnight',
    category: 'crisis'
  }
];

export default function CrisisSupport() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Need Immediate Help?</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-lg font-semibold text-red-700">
            If you&apos;re experiencing thoughts of suicide or severe emotional distress, please reach out for help immediately.
          </p>
          <p className="text-red-700 mt-2 text-xl font-bold">
            Call 999 for emergencies or 116 123 for Samaritans
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {['emergency', 'crisis', 'support'].map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              {category} Resources
            </h3>
            <div className="grid gap-4">
              {RESOURCES.filter(resource => resource.category === category).map((resource) => (
                <div
                  key={resource.name}
                  className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-100 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.name}
                  </h4>
                  <p className="text-gray-600 mb-3">{resource.description}</p>
                  <div className="space-y-2">
                    {resource.contact && (
                      <p className="text-blue-600 font-medium">
                        Contact: {resource.contact}
                      </p>
                    )}
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Visit Website →
                      </a>
                    )}
                    <p className="text-sm text-gray-500">
                      Available: {resource.available}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Additional Support
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Call 999 for immediate emergency services</li>
          <li>Contact your GP for mental health support</li>
          <li>Visit your nearest A&E if you need immediate help</li>
          <li>Use the NHS 111 online service for urgent medical advice</li>
        </ul>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          Note: This is not a comprehensive list of all available resources. Different areas within the UK may have additional local support services available.
        </p>
      </div>
    </div>
  );
} 