export function ImportExport({ onExport, onImport }) {
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) {
          onImport(imported);
        } else {
          alert('Неверный формат: нужен массив объектов');
        }
      } catch (err) {
        alert('Ошибка чтения файла');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="export-section">
      <button onClick={onExport} className="export-btn">&#11015; Экспорт (JSON)</button>
      <label className="import-btn">
        	&#11014; Импорт
        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </label>
    </div>
  );
}