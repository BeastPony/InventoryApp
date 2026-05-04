export function PrinterForm({ formData, setFormData, onSubmit, editingId, onCancel }) {
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
        name="name"
        placeholder="Имя"
        value={formData.name || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Локация"
        value={formData.location || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="model"
        placeholder="Модель принтера"
        value={formData.model || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="serial"
        placeholder="Серийный номер"
        value={formData.serial || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="ipAddress"
        placeholder="IP Адрес"
        value={formData.ipAddress || ''}
        onChange={handleChange}
      />
      <select name="status" value={formData.status || 'active'} onChange={handleChange}>
        <option value="active">Работает</option>
        <option value="maintenance">Выключен</option>
        <option value="offline">Отсутствует</option>
        <option value="broken">Неисправен</option>
      </select>
      <button type="submit">{editingId !== null ? 'Сохранить' : 'Добавить принтер'}</button>
      {editingId !== null && (
        <button type="button" onClick={onCancel} className="cancel-btn">Отмена</button>
      )}
    </form>
  );
}