const printerStatusLabels = {
  active: 'Работает',
  maintenance: 'Выключен',
  offline: 'Отсутствует',
  broken: 'Неисправен'
};

export function PrinterTable({ printers, onEdit, onDelete }) {
  if (printers.length === 0) {
    return <p className="empty-message">Нет принтеров. Добавьте первый.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Локация</th>
          <th>Модель принтера</th>
          <th>Серийный номер</th>
          <th>IP Адрес</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {printers.map(printer => (
          <tr key={printer.id}>
            <td>{printer.name}</td>
            <td>{printer.location || '—'}</td>
            <td>{printer.model || '—'}</td>
            <td>{printer.serial || '—'}</td>
            <td>{printer.ipAddress || '—'}</td>
            <td>
              <span className={`status-badge status-${printer.status}`}>
                {printerStatusLabels[printer.status] || printer.status}
              </span>
            </td>
            <td>
              <button onClick={() => onEdit(printer)} className="edit-btn">&#9998;</button>
              <button onClick={() => onDelete(printer.id)} className="delete-btn">&#128465;</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}