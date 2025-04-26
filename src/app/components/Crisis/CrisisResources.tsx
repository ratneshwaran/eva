// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

'use client';

import { FaPhone, FaGlobe, FaComments, FaHospital } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

export default function CrisisResources() {
  const { theme } = useTheme();
  const borderClass = `border-${theme}-100`;
  const bgClass = `bg-${theme}-50`;
  const textClass = `text-${theme}-700`;
  const hoverTextClass = `hover:text-${theme}-900`;

  const emergencyResources = [
    {
      name: "AASRA",
      phone: "91-9820466726",
      description: "24/7 Helpline for emotional support and suicide prevention",
      website: "http://www.aasra.info/",
      icon: FaPhone
    },
    {
      name: "iCall Helpline",
      phone: "91-9152987821",
      description: "Psychosocial helpline by TISS (Mon-Sat, 10 AM-8 PM)",
      website: "https://icallhelpline.org/",
      icon: FaComments
    }
  ];

  const additionalResources = [
    {
      name: "NIMHANS",
      phone: "080-46110007",
      description: "National Institute of Mental Health and Neurosciences - Mental health support and resources",
      website: "https://nimhans.ac.in",
      icon: FaHospital
    },
    {
      name: "Vandrevala Foundation",
      phone: "1860-2662-345",
      description: "24/7 mental health helpline and counseling",
      website: "https://vandrevalafoundation.com",
      icon: FaGlobe
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Emergency Warning</h2>
        <p className="text-lg text-red-600">
          If you or someone else is in immediate danger, please call emergency services immediately:
          <br />
          <span className="font-bold">Ambulance: 102</span>
          <br />
          <span className="font-bold">Police: 100</span>
        </p>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Crisis Resources in India</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">24/7 Mental Health Support</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {emergencyResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-2 ${borderClass} ${bgClass}`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`${textClass} w-6 h-6 mr-2`} />
                    <h3 className="text-lg font-semibold text-gray-900" >{resource.name}</h3>
                  </div>
                  <p className={`${textClass} text-lg font-semibold mb-2`}>{resource.phone}</p>
                  <p className="text-gray-700 mb-4">{resource.description}</p>
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center ${textClass} ${hoverTextClass} transition-colors`}
                  >
                    Visit Website
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Mental Health Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {additionalResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-2 ${borderClass} ${bgClass}`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`${textClass} w-6 h-6 mr-2`} />
                    <h3 className="text-lg font-semibold text-gray-900" >{resource.name}</h3>
                  </div>
                  <p className={`${textClass} text-lg font-semibold mb-2`}>{resource.phone}</p>
                  <p className="text-gray-700 mb-4">{resource.description}</p>
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center ${textClass} ${hoverTextClass} transition-colors`}
                  >
                    Visit Website
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
          <p className="text-gray-700">
            These helplines provide support in multiple languages including Hindi, English, and regional languages. 
            Services are confidential and available to anyone in need of emotional support or experiencing mental health challenges.
          </p>
        </section>
      </div>
    </div>
  );
} 