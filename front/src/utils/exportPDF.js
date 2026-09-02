import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Exporte un tableau en PDF.
 *
 * @param {Object} options
 * @param {string}   options.title      - Titre du document
 * @param {string[]} options.headers    - En-têtes de colonnes
 * @param {any[][]}  options.rows       - Données du tableau (array de lignes)
 * @param {string}   [options.fileName] - Nom du fichier (sans extension)
 */
export function exportToPDF({ title, headers, rows, fileName = 'export' }) {
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Titre
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 28);

  // Tableau
  doc.autoTable({
    startY: 34,
    head: [headers],
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 255],
    },
    margin: { left: 14, right: 14 },
  });

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `VisiTrack — Page ${i}/${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`${fileName}.pdf`);
}

/**
 * Exporte un tableau en CSV.
 *
 * @param {Object} options
 * @param {string[]} options.headers    - En-têtes
 * @param {any[][]}  options.rows       - Données
 * @param {string}   [options.fileName] - Nom du fichier
 */
export function exportToCSV({ headers, rows, fileName = 'export' }) {
  const csvContent = [
    headers.join(';'),
    ...rows.map((row) =>
      row.map((cell) => {
        const val = String(cell ?? '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(';')
    ),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
