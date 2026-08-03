import * as XLSX from 'xlsx';

export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  getValue?: (item: T) => string | number | boolean | null | undefined;
}

/**
 * Exports data to a native Microsoft Excel (.xlsx) file with automatically calculated column widths.
 * Every column width is measured against the longest cell text + padding, so words never overlap in Excel.
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  filenamePrefix: string,
  sheetName: string = 'DELCA Intelligence'
) {
  const headerRow = columns.map(c => c.label);

  const rows = data.map(item =>
    columns.map(col => {
      if (col.getValue) {
        const val = col.getValue(item);
        return val === null || val === undefined ? '' : String(val);
      }
      const rawVal = item[col.key as keyof T];
      if (rawVal === null || rawVal === undefined) return '';
      if (typeof rawVal === 'object') return JSON.stringify(rawVal);
      return String(rawVal);
    })
  );

  const worksheetData = [headerRow, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Calculate column widths automatically to ensure text and words NEVER overlap in Excel
  const colWidths = headerRow.map((header, colIdx) => {
    let maxLen = header.length;
    rows.forEach(row => {
      const cellVal = String(row[colIdx] || '');
      // Measure longest line in cell
      const lines = cellVal.split('\n');
      lines.forEach(line => {
        if (line.length > maxLen) {
          maxLen = line.length;
        }
      });
    });
    // Add 4 padding spaces so text does not touch cell borders, clamp between 14 and 85
    return { wch: Math.min(Math.max(maxLen + 4, 14), 85) };
  });

  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fullFilename = `${filenamePrefix}_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, fullFilename);
}

/**
 * Exports data to a UTF-8 CSV with Byte Order Mark (\uFEFF) so Excel opens characters and numbers properly.
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  filenamePrefix: string
) {
  const headerRow = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');

  const rows = data.map(item =>
    columns
      .map(col => {
        let strVal = '';
        if (col.getValue) {
          const val = col.getValue(item);
          strVal = val === null || val === undefined ? '' : String(val);
        } else {
          const rawVal = item[col.key as keyof T];
          strVal = rawVal === null || rawVal === undefined ? '' : String(rawVal);
        }
        return `"${strVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  // UTF-8 BOM (\uFEFF) forces Excel to recognize UTF-8 encoding
  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
