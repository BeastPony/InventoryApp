export function CartridgeTable({ cartridges, onEdit, onDelete }) {
  if (cartridges.length === 0) {
    return <p className="empty-message">Нет картриджей. Добавьте первый.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Модель принтера</th>
          <th>Модель картриджа</th>
          <th>Количество</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {cartridges.map(cartridge => (
          <tr key={cartridge.id}>
            <td>{cartridge.printerModel}</td>
            <td>{cartridge.cartridgeModel || '—'}</td>
            <td>{cartridge.quantity || '—'}</td>
            <td>
              <button onClick={() => onEdit(cartridge)} className="edit-btn">&#9998;</button>
              <button onClick={() => onDelete(cartridge.id)} className="delete-btn">&#128465;</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}