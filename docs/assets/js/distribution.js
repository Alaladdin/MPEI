document.addEventListener('DOMContentLoaded', async () => {
  const handleError = () => {
    const errorEl = document.querySelector('.distribution-error');
    errorEl.classList.remove('sr-only');
  };
  const distributionEL = document.querySelector('.distribution-table');
  const table = distributionEL.querySelector('table');
  const { sheetId, sheetName } = table.dataset || {};
  const sheetData = fetch(`https://gsx2json.com/api?id=${sheetId}&sheet=${sheetName}`)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);

      return res.json();
    })
    .catch(handleError);
  const { columns, rows } = await sheetData || {};

  if (columns && rows) {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const theadTR = document.createElement('tr');

    distributionEL.classList.remove('sr-only');
    thead.appendChild(theadTR);

    // columns render
    Object.keys(columns).forEach((columnName) => {
      const th = document.createElement('th');

      th.textContent = columnName;
      theadTR.appendChild(th);
    });

    // rows render
    rows.forEach((row) => {
      const tbodyTR = document.createElement('tr');

      tbody.appendChild(tbodyTR);

      Object.values(row).forEach((rowName) => {
        const td = document.createElement('td');

        td.textContent = rowName.toString();
        tbodyTR.appendChild(td);
      });
    });
  }
});
