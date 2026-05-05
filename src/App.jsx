import { useRef, useState } from 'react';
import { api } from './api';
import { useApi } from './hooks/useApi';
import { Tabs } from './components/Tabs';
import { ImportExport } from './components/ImportExport';
import { NotebookForm } from './components/NotebookForm';
import { NotebookTable } from './components/NotebookTable';
import { PrinterForm } from './components/PrinterForm';
import { PrinterTable } from './components/PrinterTable';
import { EquipmentSection } from './components/EquipmentSection';
import { CartridgeForm } from './components/CartridgeForm';
import { CartridgeTable } from './components/CartridgeTable';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'notebook';
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('activeTab', tabId);
  };

  const { data: notebooks, setData: setNotebooks, loading: notebooksLoading } = useApi(api.getNotebooks, []);
  const { data: printers, setData: setPrinters, loading: printersLoading } = useApi(api.getPrinters, []);
  const { data: cartridges, setData: setCartridges, loading: cartridgesLoading } = useApi(api.getCartridges, []);
  const equipmentRef = useRef();

  // Состояния форм (camelCase)
  const [notebookForm, setNotebookForm] = useState({
    invNumber: '', computerName: '', currentUser: '', location: '', serviceTag: '', model: '', status: 'active'
  });
  const [editingNotebookId, setEditingNotebookId] = useState(null);

  const [printerForm, setPrinterForm] = useState({
    name: '', location: '', model: '', serial: '', ipAddress: '', status: 'active'
  });
  const [editingPrinterId, setEditingPrinterId] = useState(null);

  const [cartridgeForm, setCartridgeForm] = useState({
    printerModel: '', cartridgeModel: '', quantity: ''
  });
  const [editingCartridgeId, setEditingCartridgeId] = useState(null);

  // --- Фильтр для ноутбуков ---
  const [notebookFilter, setNotebookFilter] = useState('all');

  // --- Ноутбуки ---
  const submitNotebook = async () => {
    const id = editingNotebookId || Date.now();
    const notebook = { id, ...notebookForm };
    if (editingNotebookId) {
      await api.updateNotebook(notebook);
      setNotebooks(prev => prev.map(n => n.id === editingNotebookId ? notebook : n));
      setEditingNotebookId(null);
    } else {
      await api.addNotebook(notebook);
      setNotebooks(prev => [...prev, notebook]);
    }
    resetNotebookForm();
  };

  const deleteNotebook = async (id) => {
    if (window.confirm('Удалить ноутбук?')) {
      await api.deleteNotebook(id);
      setNotebooks(prev => prev.filter(n => n.id !== id));
    }
  };

  const editNotebook = (item) => {
    setNotebookForm({ ...item });
    setEditingNotebookId(item.id);
  };

  const cancelNotebookEdit = () => {
    resetNotebookForm();
    setEditingNotebookId(null);
  };

  const resetNotebookForm = () => {
    setNotebookForm({ invNumber: '', computerName: '', currentUser: '', location: '', serviceTag: '', model: '', status: 'active' });
  };

  // --- Принтеры ---
  const submitPrinter = async () => {
    const id = editingPrinterId || Date.now();
    const printer = { id, ...printerForm };
    if (editingPrinterId) {
      await api.updatePrinter(printer);
      setPrinters(prev => prev.map(p => p.id === editingPrinterId ? printer : p));
      setEditingPrinterId(null);
    } else {
      await api.addPrinter(printer);
      setPrinters(prev => [...prev, printer]);
    }
    resetPrinterForm();
  };

  const deletePrinter = async (id) => {
    if (window.confirm('Удалить принтер?')) {
      await api.deletePrinter(id);
      setPrinters(prev => prev.filter(p => p.id !== id));
    }
  };

  const editPrinter = (item) => {
    setPrinterForm({ ...item });
    setEditingPrinterId(item.id);
  };

  const cancelPrinterEdit = () => {
    resetPrinterForm();
    setEditingPrinterId(null);
  };

  const resetPrinterForm = () => {
    setPrinterForm({ name: '', location: '', model: '', serial: '', ipAddress: '', status: 'active' });
  };

  // --- Картриджи ---
  const submitCartridge = async () => {
    const id = editingCartridgeId || Date.now();
    const cartridge = { id, ...cartridgeForm };
    if (editingCartridgeId) {
      await api.updateCartridge(cartridge);
      setCartridges(prev => prev.map(c => c.id === editingCartridgeId ? cartridge : c));
      setEditingCartridgeId(null);
    } else {
      await api.addCartridge(cartridge);
      setCartridges(prev => [...prev, cartridge]);
    }
    resetCartridgeForm();
  };

  const deleteCartridge = async (id) => {
    if (window.confirm('Удалить картридж?')) {
      await api.deleteCartridge(id);
      setCartridges(prev => prev.filter(c => c.id !== id));
    }
  };

  const editCartridge = (item) => {
    setCartridgeForm({ ...item });
    setEditingCartridgeId(item.id);
  };

  const cancelCartridgeEdit = () => {
    resetCartridgeForm();
    setEditingCartridgeId(null);
  };

  const resetCartridgeForm = () => {
    setCartridgeForm({ printerModel: '', cartridgeModel: '', quantity: '' });
  };

  const printTable = (columns, data, title) => {
    const rowsHtml = data.map(row => `
      <tr>
        ${columns.map(col => `<td>${row[col.key] || '—'}</td>`).join('')}
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        h2 { text-align: center; }
      </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();  // закрыть после печати
  };

  // Печать ноутбуков
const printNotebooks = () => {
  const columns = [
    { key: 'invNumber', label: 'Инв. номер' },
    { key: 'computerName', label: 'Имя компьютера' },
    { key: 'currentUser', label: 'Текущий юзер' },
    { key: 'location', label: 'Место хранения' },
    { key: 'serviceTag', label: 'Service Tag' },
    { key: 'model', label: 'Модель' },
    { key: 'status', label: 'Статус' }
  ];
  // Для статуса можно вывести "Используется"/"В запасе" как в таблице, но оставим пока исходное значение
  printTable(columns, notebooks, 'Ноутбуки');
};

// Печать принтеров
const printPrinters = () => {
  const columns = [
    { key: 'name', label: 'Имя' },
    { key: 'location', label: 'Локация' },
    { key: 'model', label: 'Модель принтера' },
    { key: 'serial', label: 'Серийный номер' },
    { key: 'ipAddress', label: 'IP Адрес' },
    { key: 'status', label: 'Статус' }
  ];
  printTable(columns, printers, 'Принтеры');
};

// Печать картриджей
const printCartridges = () => {
  const columns = [
    { key: 'printerModel', label: 'Модель принтера' },
    { key: 'cartridgeModel', label: 'Модель картриджа' },
    { key: 'quantity', label: 'Количество' }
  ];
  printTable(columns, cartridges, 'Картриджи');
};


  // --- Экспорт / Импорт ---
  const exportData = () => {
    const data = activeTab === 'notebook' ? notebooks
              : activeTab === 'printers' ? printers
              : activeTab === 'cartridges' ? cartridges
              : null;
    if (data) {
      const fileName = `${activeTab}_backup.json`;
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else if (activeTab === 'equipment' && equipmentRef.current) {
      equipmentRef.current.exportData().then(exported => {
        const dataStr = JSON.stringify(exported, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'equipment_backup.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const importData = async (importedData) => {
    try {
      if (activeTab === 'notebook') {
        for (const item of importedData) {
          await api.addNotebook(item);
        }
        setNotebooks(await api.getNotebooks());
      } else if (activeTab === 'printers') {
        for (const item of importedData) {
          await api.addPrinter(item);
        }
        setPrinters(await api.getPrinters());
      } else if (activeTab === 'cartridges') {
        for (const item of importedData) {
          await api.addCartridge(item);
        }
        setCartridges(await api.getCartridges());
      } else if (activeTab === 'equipment' && equipmentRef.current) {
        await equipmentRef.current.importData(importedData);
      }
      alert('Импорт завершён');
    } catch (err) {
      alert('Ошибка импорта: ' + err.message);
    }
  };

  const tabs = [
    { id: 'notebook', label: 'Ноутбуки' },
    { id: 'equipment', label: 'Оборудование' },
    { id: 'printers', label: 'Принтеры' },
    { id: 'cartridges', label: 'Картриджи' }
  ];

  return (
    <div className="container">
      <h1>IT-оборудование</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'notebook' && (
        <div className="tab-content">
          <NotebookForm
            formData={notebookForm}
            setFormData={setNotebookForm}
            onSubmit={submitNotebook}
            editingId={editingNotebookId}
            onCancel={cancelNotebookEdit}
          />
          <div className="filter-bar" style={{ marginBottom: '10px' }}>
            <select
              value={notebookFilter}
              onChange={(e) => setNotebookFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '0.9rem',
                borderRadius: '5px',
                border: '1px solid #9ffd79',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="all">Все</option>
              <option value="active">Используется</option>
              <option value="stock">В запасе</option>
            </select>
            <button onClick={printNotebooks} className="print-btn" title="Печать таблицы">
              &#128438; Печать
            </button>
          </div>

          {notebooksLoading ? (
            <p className="empty-message">Загрузка...</p>
          ) : (
            <NotebookTable
              notebooks={
                notebookFilter === 'all'
                  ? notebooks
                  : notebooks.filter(n => n.status === notebookFilter)
              }
              onEdit={editNotebook}
              onDelete={deleteNotebook}
            />
          )}
        </div>
      )}

      {activeTab === 'equipment' && <EquipmentSection ref={equipmentRef} />}

      {activeTab === 'printers' && (
        <div className="tab-content">
          <PrinterForm
            formData={printerForm}
            setFormData={setPrinterForm}
            onSubmit={submitPrinter}
            editingId={editingPrinterId}
            onCancel={cancelPrinterEdit}
          />
          <div style={{ marginBottom: '10px' }}>
            <button
              className="export-btn"
              onClick={async () => {
                try {
                  await fetch('/api/printers/ping-all', { method: 'POST' });
                  alert('Пинг запущен. Дождитесь обновления статусов.');
                  setTimeout(async () => {
                    const fresh = await api.getPrinters();
                    setPrinters(fresh);
                  }, 5000); 
                } catch (err) {
                  alert('Ошибка при запуске пинга');
                }
              }}
            >
              Запустить ping хостов &#8635;
            </button>
            <button onClick={printPrinters} className="print-btn" title="Печать таблицы">
              &#128438; Печать
            </button>
          </div>
          {printersLoading ? (
            <p className="empty-message">Загрузка...</p>
          ) : (
            <PrinterTable
              printers={printers}
              onEdit={editPrinter}
              onDelete={deletePrinter}
            />
          )}
        </div>
      )}

      {activeTab === 'cartridges' && (
        <div className="tab-content">
          <CartridgeForm
            formData={cartridgeForm}
            setFormData={setCartridgeForm}
            onSubmit={submitCartridge}
            editingId={editingCartridgeId}
            onCancel={cancelCartridgeEdit}
          />
          <button onClick={printCartridges} className="print-btn" title="Печать таблицы">
            &#128438; Печать
          </button>
          {cartridgesLoading ? <p className="empty-message">Загрузка...</p> :
            <CartridgeTable cartridges={cartridges} onEdit={editCartridge} onDelete={deleteCartridge} />
          }
        </div>
      )}

      <ImportExport onExport={exportData} onImport={importData} />
    </div>
  );
}

export default App;