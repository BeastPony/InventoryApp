import { forwardRef, useImperativeHandle, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentTable } from './EquipmentTable';

// Названия складов для отображения
const warehouseNames = {
  warehouse1: 'ABK IT офис',
  warehouse2: 'ABK Кладовая',
  warehouse3: 'VCE Кладовая',
};

export const EquipmentSection = forwardRef((props, ref) => {
  // Инициализация складов с миграцией старых данных из 'itEquipment'
  const initWarehouses = () => {
    const stored = localStorage.getItem('itEquipmentWarehouses');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { warehouse1: [], warehouse2: [], warehouse3: [] };
      }
    }
    const oldEquipment = localStorage.getItem('itEquipment');
    if (oldEquipment) {
      try {
        const oldArray = JSON.parse(oldEquipment);
        if (Array.isArray(oldArray)) {
          localStorage.removeItem('itEquipment'); // удаляем старый ключ
          return { warehouse1: oldArray, warehouse2: [], warehouse3: [] };
        }
      } catch {}
    }
    return { warehouse1: [], warehouse2: [], warehouse3: [] };
  };

  const [warehouses, setWarehouses] = useLocalStorage('itEquipmentWarehouses', initWarehouses());
  const [selectedWarehouse, setSelectedWarehouse] = useState('warehouse1');

  // Состояния формы и редактирования
  const [equipForm, setEquipForm] = useState({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
  const [editingEquipId, setEditingEquipId] = useState(null);

  // Получить данные текущего склада
  const getCurrentWarehouseData = () => warehouses[selectedWarehouse] || [];

  // ---- CRUD операции ----
  const submitEquipment = () => {
    const currentData = getCurrentWarehouseData();
    let newWarehouses;
    if (editingEquipId !== null) {
      newWarehouses = {
        ...warehouses,
        [selectedWarehouse]: currentData.map(item =>
          item.id === editingEquipId ? { ...equipForm, id: editingEquipId } : item
        ),
      };
    } else {
      newWarehouses = {
        ...warehouses,
        [selectedWarehouse]: [...currentData, { ...equipForm, id: Date.now() }],
      };
    }
    setWarehouses(newWarehouses);
    setEquipForm({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
    setEditingEquipId(null);
  };

  const deleteEquipment = (id) => {
    if (window.confirm('Удалить оборудование?')) {
      const newWarehouses = {
        ...warehouses,
        [selectedWarehouse]: warehouses[selectedWarehouse].filter(item => item.id !== id),
      };
      setWarehouses(newWarehouses);
    }
  };

  const editEquipment = (item) => {
    setEquipForm({ ...item });
    setEditingEquipId(item.id);
  };

  const cancelEquipmentEdit = () => {
    setEquipForm({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
    setEditingEquipId(null);
  };

  const handleWarehouseChange = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
    setEditingEquipId(null);
    setEquipForm({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
  };

  // ---- Экспорт / импорт для родителя (App) ----
  const exportData = () => warehouses;

  const importData = (importedData) => {
    if (importedData && typeof importedData === 'object' &&
        'warehouse1' in importedData && 'warehouse2' in importedData && 'warehouse3' in importedData) {
      setWarehouses(importedData);
      return true;
    }
    return false;
  };

  // Предоставляем методы наружу через ref
  useImperativeHandle(ref, () => ({
    exportData,
    importData,
  }));

  // Компонент выбора склада
  const WarehouseSelector = () => (
    <div className="warehouse-selector">
      {Object.entries(warehouseNames).map(([id, label]) => (
        <button
          key={id}
          className={`warehouse-btn ${selectedWarehouse === id ? 'active' : ''}`}
          onClick={() => handleWarehouseChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="tab-content">
      <WarehouseSelector />
      <div className="warehouse-content">
        <h3>{warehouseNames[selectedWarehouse]}</h3>
        <EquipmentForm
          formData={equipForm}
          setFormData={setEquipForm}
          onSubmit={submitEquipment}
          editingId={editingEquipId}
          onCancel={cancelEquipmentEdit}
        />
        <EquipmentTable
          equipment={warehouses[selectedWarehouse]}
          onEdit={editEquipment}
          onDelete={deleteEquipment}
        />
      </div>
    </div>
  );
});