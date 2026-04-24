const statusLabels = {
  active: 'Используется',
  stock: 'В запасе',
};

export function NotebookTable({ notebooks, onEdit, onDelete }) {
  if (notebooks.length === 0) {
    return <p className="empty-message">Нет ноутбуков. Добавьте первый.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Инв. номер</th>
          <th>Имя компьютера</th>
          <th>Текущий юзер</th>
          <th>Место хранения</th>
          <th>Service Tag</th>
          <th>Модель</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {notebooks.map(notebook => (
          <tr key={notebook.id}>
            <td>{notebook.invNumber}</td>
            <td>{notebook.computerName || '—'}</td>
            <td>{notebook.currentUser || '—'}</td>
            <td>{notebook.location || '—'}</td>
            <td>{notebook.serviceTag || '—'}</td>
            <td>{notebook.model || '—'}</td>
            <td>
              <span className={`status-badge status-${notebook.status}`}>
                {statusLabels[notebook.status] || notebook.status}
              </span>
            </td>
            <td>
              <button onClick={() => onEdit(notebook)} className="edit-btn">&#9998;</button>
              <button onClick={() => onDelete(notebook.id)} className="delete-btn">&#128465;</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}