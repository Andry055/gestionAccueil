import React from 'react';
import { 
  InformationCircleIcon,
  UserGroupIcon,
  CodeBracketIcon,
  HeartIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useDarkMode } from './utils/DarkModeContext';

const About = () => {
  const { darkMode } = useDarkMode();

  // Styles dynamiques
  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const highlightColor = darkMode ? "text-indigo-400" : "text-indigo-600";

  // Version de l'application
  const appVersion = "1.2.0";

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300 p-6`}>
      <main className={`max-w-4xl mx-auto`}>
        {/* Titre principal */}
        <div className="text-center mt-20 mb-12">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            À propos de notre application
          </h1>
          <div className={`w-20 h-1 ${highlightColor} mx-auto`}></div>
        </div>

        {/* Section Notre Mission */}
        <div className={`mb-10 p-6 ${cardBg} rounded-lg shadow border ${borderColor}`}>
          <div className="flex items-center mb-4">
            <InformationCircleIcon className={`h-8 w-8 ${highlightColor} mr-2`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              Notre Mission
            </h2>
          </div>
          <p className={textSecondary}>
            Nous développons des solutions logicielles intuitives pour simplifier la gestion 
            des services et améliorer la productivité de nos utilisateurs.
          </p>
        </div>

        {/* Section Version */}
        <div className={`mb-10 p-6 ${cardBg} rounded-lg shadow border ${borderColor}`}>
          <div className="flex items-center mb-4">
            <TagIcon className={`h-8 w-8 ${highlightColor} mr-2`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              Version de l'application
            </h2>
          </div>
          <p className={textSecondary}>
            Version actuelle : <span className={`font-medium ${highlightColor}`}>{appVersion}</span>
          </p>
          <p className={`mt-2 text-sm ${textSecondary}`}>
            Dernière mise à jour : 15 juin 2024
          </p>
        </div>

        {/* Section Contact */}
        <div className={`p-6 ${cardBg} rounded-lg shadow border ${borderColor}`}>
          <div className="flex items-center mb-4">
            <HeartIcon className={`h-8 w-8 ${highlightColor} mr-2`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              Contact
            </h2>
          </div>
          <p className={textSecondary}>
            Email : nirinaa070@gmail.com<br />
            Téléphone : 0384710800
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;