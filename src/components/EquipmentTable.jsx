const statusLabels = {
  active: 'В наличии',
  stock: 'Отсутствует',
};

export function EquipmentTable({ equipment, onEdit, onDelete }) {
  if (equipment.length === 0) {
    return <p className="empty-message">Нет оборудования. Добавьте первый актив.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Тип оборудования</th>
          <th>Фирма</th>
          <th>Модель</th>
          <th>Количество</th>
          <th>Комментарий</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {equipment.map(item => (
          <tr key={item.id}>
            <td>{item.type}</td>
            <td>{item.firma || '—'}</td>
            <td>{item.model || '—'}</td>
            <td>{item.quantity || '—'}</td>
            <td>{item.comment || '—'}</td>
            <td>
              <span className={`status-badge status-${item.status}`}>
                {statusLabels[item.status] || item.status}
              </span>
            </td>
            <td>
              <button onClick={() => onEdit(item)} className="edit-btn">&#9998;</button>
              <button onClick={() => onDelete(item.id)} className="delete-btn">&#128465;</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}