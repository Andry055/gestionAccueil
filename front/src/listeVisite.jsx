import React from "react";

export default function VisiteListPopup({ open, onClose, visites }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-5xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Liste des visites</h2>
        <div className="flex justify-between px-5">
        <i><p className="m-5 text-2xl text-gray-800">ANDIANIAINA Rivo</p></i>
        <i><p className="m-5 text-2xl text-gray-800">201024512478</p></i>
        </div>

        <table className="w-full border-collapse table-auto text-gray-700">
          <thead className="bg-indigo-100 sticky top-0 z-10">
            <tr>
              {["Date", "Heure d'arrivée", "Heure de sortie", "Motif", "Service visité", "Chef de service"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 border-b border-gray-300 text-left font-medium text-indigo-700 whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visites.length > 0 ? (
              visites.map((visite, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b whitespace-nowrap">{visite.date}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{visite.heureArr}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{visite.heureSor || "-"}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{visite.motif}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{visite.service}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{visite.chefService}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
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
