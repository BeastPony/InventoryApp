const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cartridges ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, printer_model, cartridge_model, quantity } = req.body;
  try {
    await pool.query(
      `INSERT INTO cartridges (id, printer_model, cartridge_model, quantity)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET
         printer_model = EXCLUDED.printer_model,
         cartridge_model = EXCLUDED.cartridge_model,
         quantity = EXCLUDED.quantity`,
      [id, printer_model, cartridge_model, quantity]
    );
    res.status(201).json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { printer_model, cartridge_model, quantity } = req.body;
  try {
    await pool.query(
      'UPDATE cartridges SET printer_model=$1, cartridge_model=$2, quantity=$3 WHERE id=$4',
      [printer_model, cartridge_model, quantity, id]
    );
    res.json({ id: Number(id), ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cartridges WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;