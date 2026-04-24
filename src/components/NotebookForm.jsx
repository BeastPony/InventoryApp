export function NotebookForm({ formData, setFormData, onSubmit, editingId, onCancel }) {
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
        name="invNumber"
        placeholder="Инв. номер"
        value={formData.invNumber || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="computerName"
        placeholder="Имя компьютера"
        value={formData.computerName || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="currentUser"
        placeholder="Текущий пользователь"
        value={formData.currentUser || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Место хранения"
        value={formData.location || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="serviceTag"
        placeholder="Service Tag"
        value={formData.serviceTag || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="model"
        placeholder="Модель"
        value={formData.model || ''}
        onChange={handleChange}
      />
      <select name="status" value={formData.status || 'active'} onChange={handleChange}>
        <option value="active">Используется</option>
        <option value="stock">В запасе</option>
      </select>
      <button type="submit">{editingId !== null ? 'Сохранить' : '➕ Добавить'}</button>
      {editingId !== null && (
        <button type="button" onClick={onCancel} className="cancel-btn">Отмена</button>
      )}
    </form>
  );
}