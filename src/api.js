import { objectToSnakeCase, objectToCamelCase } from "./utils/transforms.js";

const API_BASE = '/api';

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

export const api = {
  // Ноутбуки
  getNotebooks: async () => {
    const data = await request('/notebooks');
    return data.map(item => {
      const camel = objectToCamelCase(item);
      // Принудительно маппим current_user_name обратно в currentUser
      camel.currentUser = camel.currentUserName || item.current_user_name || '';
      delete camel.currentUserName;
      return camel;
    });
  },
  addNotebook: (notebook) => {
    const snake = objectToSnakeCase(notebook);
    // подменяем current_user -> current_user_name
    if (snake.current_user !== undefined) {
      snake.current_user_name = snake.current_user;
      delete snake.current_user;
    }
    return request('/notebooks', {
      method: 'POST',
      body: JSON.stringify(snake),
    });
  },
  updateNotebook: (notebook) => {
    const snake = objectToSnakeCase(notebook);
    if (snake.current_user !== undefined) {
      snake.current_user_name = snake.current_user;
      delete snake.current_user;
    }
    return request(`/notebooks/${notebook.id}`, {
      method: 'PUT',
      body: JSON.stringify(snake),
    });
  },
  deleteNotebook: (id) => request(`/notebooks/${id}`, { method: 'DELETE' }),

  // Принтеры
  getPrinters: async () => {
    const data = await request('/printers');
    return data.map(item => objectToCamelCase(item));
  },
  addPrinter: (printer) => request('/printers', {
    method: 'POST',
    body: JSON.stringify(objectToSnakeCase(printer)),
  }),
  updatePrinter: (printer) => request(`/printers/${printer.id}`, {
    method: 'PUT',
    body: JSON.stringify(objectToSnakeCase(printer)),
  }),
  deletePrinter: (id) => request(`/printers/${id}`, { method: 'DELETE' }),

  // Картриджи
  getCartridges: async () => {
    const data = await request('/cartridges');
    return data.map(item => objectToCamelCase(item));
  },
  addCartridge: (cartridge) => request('/cartridges', {
    method: 'POST',
    body: JSON.stringify(objectToSnakeCase(cartridge)),
  }),
  updateCartridge: (cartridge) => request(`/cartridges/${cartridge.id}`, {
    method: 'PUT',
    body: JSON.stringify(objectToSnakeCase(cartridge)),
  }),
  deleteCartridge: (id) => request(`/cartridges/${id}`, { method: 'DELETE' }),

  // Склады
  getWarehouses: () => request('/warehouses'),

  // Оборудование (поля и так snake_case, не трогаем)
  getEquipment: (warehouseId) => request(`/equipment?warehouseId=${warehouseId}`),
  getAllEquipment: () => request('/equipment'),
  addEquipment: (equipment) => request('/equipment', {
    method: 'POST',
    body: JSON.stringify(equipment),
  }),
  updateEquipment: (equipment) => request(`/equipment/${equipment.id}`, {
    method: 'PUT',
    body: JSON.stringify(equipment),
  }),
  deleteEquipment: (id) => request(`/equipment/${id}`, { method: 'DELETE' }),
};