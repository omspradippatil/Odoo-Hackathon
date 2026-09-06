/**
 * Utilities for exporting data to CSV and Excel (XLSX/XLS) spreadsheets.
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  if (typeof window === "undefined") return;

  const escapeCell = (val: string | number) => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.search(/("|,|\n|\r)/g) >= 0) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [
    headers.map(escapeCell).join(","),
    ...rows.map(row => row.map(escapeCell).join(","))
  ];

  const csvContent = "\uFEFF" + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][]
) {
  if (typeof window === "undefined") return;

  // Build standard Excel XML Spreadsheet 2003 which Excel opens natively as .xlsx / .xls
  const safeFilename = filename.endsWith(".xlsx") || filename.endsWith(".xls") 
    ? filename 
    : `${filename}.xlsx`;

  const escapeXml = (str: string | number) => {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const headerCells = headers
    .map(h => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`)
    .join("");

  const dataRows = rows
    .map(row => {
      const cells = row
        .map(val => {
          const isNum = typeof val === "number" && !isNaN(val);
          const type = isNum ? "Number" : "String";
          return `<Cell><Data ss:Type="${type}">${escapeXml(val)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  const excelXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table>
   <Row ss:Height="24">
    ${headerCells}
   </Row>
   ${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([excelXml], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
