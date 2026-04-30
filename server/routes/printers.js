const express = require('express');
const router = express.Router();
const pool = require('../db');
const { pingAllPrinters } = require('../services/pingService');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM printers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ping-all', async (req, res) => {
  try {
    // Запускаем пинг без ожидания ответа, чтобы не блокировать запрос
    pingAllPrinters(); // выполняется асинхронно
    res.json({ message: 'Ping started for eligible printers' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, name, location, model, serial, ip_address, status } = req.body;
  try {
    await pool.query(
      `INSERT INTO printers (id, name, location, model, serial, ip_address, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         location = EXCLUDED.location,
         model = EXCLUDED.model,
         serial = EXCLUDED.serial,
         ip_address = EXCLUDED.ip_address,
         status = EXCLUDED.status`,
      [id, name, location, model, serial, ip_address, status]
    );
    res.status(201).json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, model, serial, ip_address, status } = req.body;
  try {
    await pool.query(
      'UPDATE printers SET name=$1, location=$2, model=$3, serial=$4, ip_address=$5, status=$6 WHERE id=$7',
      [name, location, model, serial, ip_address, status, id]
    );
    res.json({ id: Number(id), ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM printers WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;