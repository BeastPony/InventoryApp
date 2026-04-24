export function EquipmentForm({ formData, setFormData, onSubmit, editingId, onCancel }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="data-form">
      <input
        type="text"
        name="type"
        placeholder="Тип оборудования"
        value={formData.type || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="firma"
        placeholder="Фирма"
        value={formData.firma || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="model"
        placeholder="Модель"
        value={formData.model || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="quantity"
        placeholder="Количество"
        value={formData.quantity || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="comment"
        placeholder="Комментарий"
        value={formData.comment || ''}
        onChange={handleChange}
      />
      <select name="status" value={formData.status || 'active'} onChange={handleChange}>
        <option value="active">В наличии</option>
        <option value="stock">Отсутствует</option>
      </select>
      <button type="submit">{editingId !== null ? 'Сохранить' : '➕ Добавить'}</button>
      {editingId !== null && (
        <button type="button" onClick={onCancel} className="cancel-btn">Отмена</button>
      )}
    </form>
  );
}