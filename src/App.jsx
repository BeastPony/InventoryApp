import { useRef, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
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
  const [activeTab, setActiveTab] = useState('notebook');

  // ----- Ноутбуки -----
  const [notebooks, setNotebooks] = useLocalStorage('notebook', []);
  const [notebookForm, setNotebookForm] = useState({ invNumber: '', computerName: '', currentUser: '', location: '', serviceTag: '', model: '', status: 'active' });
  const [editingNotebookId, setEditingNotebookId] = useState(null);

  // ----- Принтеры -----
  const [printers, setPrinters] = useLocalStorage('printers', []);
  const [printerForm, setPrinterForm] = useState({ name: '', location: '', model: '', serial: '', ipAddress: '', status: 'active'});
  const [editingPrinterId, setEditingPrinterId] = useState(null);

  // ----- Картриджи -----
  const [cartridges, setCartridges] = useLocalStorage('cartridges', []);
  const [cartridgeForm, setCartridgeForm] = useState({ printerModel: '', cartridgeModel: '', quantity: ''});
  const [editingCartridgeId, setEditingCartridgeId] = useState(null);

  // Ref для компонента оборудования (чтобы вызывать его методы экспорта/импорта)
  const equipmentRef = useRef();

  // --- Функции для ноутбуков ---
  const submitNotebook = () => {
    if (editingNotebookId !== null) {
      setNotebooks(notebooks.map(item =>
        item.id === editingNotebookId ? { ...notebookForm, id: editingNotebookId } : item
      ));
      setEditingNotebookId(null);
    } else {
      setNotebooks([...notebooks, { ...notebookForm, id: Date.now() }]);
    }
    setNotebookForm({ invNumber: '', computerName: '', currentUser: '', location: '', serviceTag: '', model: '', status: 'active' });
  };

  const deleteNotebook = (id) => {
    if (window.confirm('Удалить ноутбук?')) {
      setNotebooks(notebooks.filter(item => item.id !== id));
    }
  };

  const editNotebook = (notebook) => {
    setNotebookForm({ ...notebook });
    setEditingNotebookId(notebook.id);
  };

  const cancelNotebookEdit = () => {
    setNotebookForm({ invNumber: '', computerName: '', currentUser: '', location: '', serviceTag: '', model: '', status: 'active' });
    setEditingNotebookId(null);
  };

  // --- Функции для принтеров ---
  const submitPrinter = () => {
    if (editingPrinterId !== null) {
      setPrinters(printers.map(p =>
        p.id === editingPrinterId ? { ...printerForm, id: editingPrinterId } : p
      ));
      setEditingPrinterId(null);
    } else {
      setPrinters([...printers, { ...printerForm, id: Date.now() }]);
    }
    setPrinterForm({ name: '', location: '', model: '', serial: '', ipAddress: '', status: 'active'});
  };

  const deletePrinter = (id) => {
    if (window.confirm('Удалить принтер?')) {
      setPrinters(printers.filter(p => p.id !== id));
    }
  };

  const editPrinter = (printer) => {
    setPrinterForm({ ...printer });
    setEditingPrinterId(printer.id);
  };

  const cancelPrinterEdit = () => {
    setPrinterForm({ name: '', location: '', model: '', serial: '', ipAddress: '', status: 'active'});
    setEditingPrinterId(null);
  };

  // --- Функции для картриджей ---
  const submitCartridge = () => {
    if (editingCartridgeId !== null) {
      setCartridges(cartridges.map(p =>
        p.id === editingCartridgeId ? { ...cartridgeForm, id: editingCartridgeId } : p
      ));
      setEditingCartridgeId(null);
    } else {
      setCartridges([...cartridges, { ...cartridgeForm, id: Date.now() }]);
    }
    setCartridgeForm({ printerModel: '', cartridgeModel: '', quantity: ''});
  };

  const deleteCartridge = (id) => {
    if (window.confirm('Удалить картридж?')) {
      setCartridges(cartridges.filter(p => p.id !== id));
    }
  };

  const editCartridge = (cartridge) => {
    setCartridgeForm({ ...cartridge });
    setEditingCartridgeId(cartridge.id);
  };

  const cancelCartridgeEdit = () => {
    setCartridgeForm({ printerModel: '', cartridgeModel: '', quantity: ''});
    setEditingCartridgeId(null);
  };

  // --- Экспорт / импорт для активной вкладки ---
  const exportData = () => {
    if (activeTab === 'notebook') {
      const data = notebooks;
      const fileName = 'notebooks_backup.json';
      downloadJSON(data, fileName);
    } else if (activeTab === 'equipment') {
      if (equipmentRef.current) {
        const data = equipmentRef.current.exportData();
        const fileName = 'equipment_warehouses_backup.json';
        downloadJSON(data, fileName);
      }
    } else if (activeTab === 'printers') {
      const data = printers;
      const fileName = 'printers_backup.json';
      downloadJSON(data, fileName);
    } else if (activeTab === 'cartridges') {
      const data = cartridges;
      const fileName = 'cartridges_backup.json';
      downloadJSON(data, fileName);
    }
  };

  const importData = (importedData) => {
    if (activeTab === 'notebook') {
      setNotebooks(importedData);
      alert('Импорт ноутбуков успешен!');
    } else if (activeTab === 'equipment') {
      if (equipmentRef.current) {
        const success = equipmentRef.current.importData(importedData);
        if (success) {
          alert('Импорт складов успешен!');
        } else {
          alert('Неверный формат данных для складов. Требуется объект с warehouse1, warehouse2, warehouse3');
        }
      }
    } else if (activeTab === 'printers') {
      setPrinters(importedData);
      alert('Импорт принтеров успешен!');
    } else if (activeTab === 'cartridges') {
      setCartridges(importedData);
      alert('Импорт картриджей успешен!');
    }
  };

  // Вспомогательная функция скачивания
  const downloadJSON = (data, fileName) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
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
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'notebook' && (
        <div className="tab-content">
          <NotebookForm
            formData={notebookForm}
            setFormData={setNotebookForm}
            onSubmit={submitNotebook}
            editingId={editingNotebookId}
            onCancel={cancelNotebookEdit}
          />
          <NotebookTable
            notebooks={notebooks}
            onEdit={editNotebook}
            onDelete={deleteNotebook}
          />
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
          <PrinterTable
            printers={printers}
            onEdit={editPrinter}
            onDelete={deletePrinter}
          />
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
          <CartridgeTable
            cartridges={cartridges}
            onEdit={editCartridge}
            onDelete={deleteCartridge}
          />
        </div>
      )}

      <ImportExport onExport={exportData} onImport={importData} />
    </div>
  );
}

export default App;