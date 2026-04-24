export function CartridgeForm({ formData, setFormData, onSubmit, editingId, onCancel }) {
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
        name="printerModel"
        placeholder="Модель принтера"
        value={formData.printerModel || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="cartridgeModel"
        placeholder="Модель картриджа"
        value={formData.cartridgeModel || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="quantity"
        placeholder="Количество"
        value={formData.quantity || ''}
        onChange={handleChange}
      />
      <button type="submit">{editingId !== null ? 'Сохранить' : '➕ Добавить картридж'}</button>
      {editingId !== null && (
        <button type="button" onClick={onCancel} className="cancel-btn">Отмена</button>
      )}
    </form>
  );
}