import React, { useEffect, useState } from "react";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";

export default function VisiteListPopup({ open, onClose, visites }) {
  const { darkMode } = useDarkMode();
  const [listeVisite , setListVisite]=useState([]);

  useEffect(()=>{
    const chargeListe= async (id)=>{
      try{
        const reponse= await axios.get(`http://localhost:5000/visite/visiteParId/${id}`);
        setListVisite(reponse.data.data);
      }
      catch(err){
        console.error(err);
      }
    }
    chargeListe(visites.id_visiteur);
  })
  
  if (!open) return null;

  // Styles dynamiques
  const modalBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-300";
  const textColor = darkMode ? "text-gray-200" : "text-gray-800";
  const closeButtonColor = darkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${modalBg} p-6 rounded-lg w-11/12 max-w-5xl shadow-xl relative border ${borderColor}`}>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 ${closeButtonColor} text-2xl`}
        >
          ✖
        </button>

        <h2 className={`text-xl font-bold mb-4 text-center ${textColor}`}>Liste des visites</h2>
        <div className="flex justify-between px-5">
          <i><p className={`m-5 text-2xl ${textColor}`}>ANDIANIAINA Rivo</p></i>
          <i><p className={`m-5 text-2xl ${textColor}`}>201024512478</p></i>
        </div>

        <table className={`w-full border-collapse table-auto ${textColor}`}>
          <thead className={`${tableHead} sticky top-0 z-10`}>
            <tr>
              {["Date", "Heure d'arrivée", "Heure de sortie", "Motif", "Service visité"].map((heading) => (
                <th
                  key={heading}
                  className={`px-4 py-3 border-b ${borderColor} text-left font-medium whitespace-nowrap`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listeVisite.length > 0 ? (
              listeVisite.map((visite, index) => (
                <tr key={index} className={`${tableRowHover} border-b ${borderColor}`}>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.heure_arrivee}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.heure_depart || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.motif}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.nom_lieu}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={`px-4 py-6 text-center ${textColor}`}>
                  Aucune visite enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}