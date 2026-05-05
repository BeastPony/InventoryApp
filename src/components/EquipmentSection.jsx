import { forwardRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentTable } from './EquipmentTable';

export const EquipmentSection = forwardRef((props, ref) => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  const [equipForm, setEquipForm] = useState({
    type: '', firma: '', model: '', quantity: '', comment: '', status: 'active'
  });
  const [editingEquipId, setEditingEquipId] = useState(null);

  // Загрузка складов
  const loadWarehouses = useCallback(async () => {
    const data = await api.getWarehouses();
    setWarehouses(data);
    if (data.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(data[0]);
    }
  }, []);

  // Загрузка оборудования выбранного склада
  const loadEquipment = useCallback(async (warehouseId) => {
    if (!warehouseId) return;
    setLoading(true);
    const data = await api.getEquipment(warehouseId);
    setEquipment(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  useEffect(() => {
    if (selectedWarehouse) {
      loadEquipment(selectedWarehouse.id);
      setEditingEquipId(null);
      setEquipForm({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
    }
  }, [selectedWarehouse, loadEquipment]);

  const handleWarehouseChange = (warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const submitEquipment = async () => {
    const itemData = {
      id: editingEquipId || Date.now(),
      type: equipForm.type,
      firma: equipForm.firma,
      model: equipForm.model,
      quantity: equipForm.quantity,
      comment: equipForm.comment,
      status: equipForm.status,
      warehouse_id: selectedWarehouse.id,
    };
    if (editingEquipId !== null) {
      await api.updateEquipment(itemData);
      setEquipment(prev => prev.map(e => e.id === editingEquipId ? itemData : e));
    } else {
      await api.addEquipment(itemData);
      setEquipment(prev => [...prev, itemData]);
    }
    setEquipForm({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
    setEditingEquipId(null);
  };

  const deleteEquipment = async (id) => {
    if (window.confirm('Удалить оборудование?')) {
      await api.deleteEquipment(id);
      setEquipment(prev => prev.filter(e => e.id !== id));
    }
  };

  const editEquipment = (item) => {
    setEquipForm({
      type: item.type,
      firma: item.firma || '',
      model: item.model || '',
      quantity: item.quantity || '',
      comment: item.comment || '',
      status: item.status,
    });
    setEditingEquipId(item.id);
  };

  const cancelEquipmentEdit = () => {
    setEquipForm({ type: '', firma: '', model: '', quantity: '', comment: '', status: 'active' });
    setEditingEquipId(null);
  };

  const exportData = async () => {
    return equipment;
  }

  const importData = async (importedData) => {
    if (Array.isArray(importedData)) {
      for (const item of importedData) {
        const eq = {
          id: item.id || Date.now().toString(),
          type: item.type || '',
          firma: item.firma || '',
          model: item.model || '',
          quantity: item.quantity || '',
          comment: item.comment || '',
          status: item.status || 'active',
          warehouse_id: selectedWarehouse?.id
        };
        await api.addEquipment(eq);
      }
      if (selectedWarehouse) {
        loadEquipment(selectedWarehouse.id);
      }
      return true;
    }

    if (importedData && importedData.equipment && Array.isArray(importedData.equipment)) {
      for (const item of importedData.equipment) {
        const eq = {
          id: item.id || Date.now().toString(),
          type: item.type || '',
          firma: item.firma || '',
          model: item.model || '',
          quantity: item.quantity || '',
          comment: item.comment || '',
          status: item.status || 'active',
          warehouse_id: item.warehouse_id || selectedWarehouse?.id
        };
        await api.addEquipment(eq);
      }
      if (selectedWarehouse) {
        loadEquipment(selectedWarehouse.id);
      }
      return true;
    }

    return false;
  };

  useImperativeHandle(ref, () => ({
    exportData,
    importData,
  }));

  return (
    <div className="tab-content">
      <div className="warehouse-selector">
        {warehouses.map(w => (
          <button
            key={w.id}
            className={`warehouse-btn ${selectedWarehouse?.id === w.id ? 'active' : ''}`}
            onClick={() => handleWarehouseChange(w)}
          >
            {w.label}
          </button>
        ))}
      </div>
      <div className="warehouse-content">
        <h3>{selectedWarehouse?.label}</h3>
        <EquipmentForm
          formData={equipForm}
          setFormData={setEquipForm}
          onSubmit={submitEquipment}
          editingId={editingEquipId}
          onCancel={cancelEquipmentEdit}
        />
        {loading ? (
          <p className="empty-message">Загрузка...</p>
        ) : (
          <EquipmentTable
            equipment={equipment}
            onEdit={editEquipment}
            onDelete={deleteEquipment}
          />
        )}
      </div>
    </div>
  );
});