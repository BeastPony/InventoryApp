const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const { warehouseId } = req.query;
  try {
    if (warehouseId) {
      const result = await pool.query(
        'SELECT * FROM equipment WHERE warehouse_id = $1 ORDER BY id',
        [warehouseId]
      );
      return res.json(result.rows);
    }
    const result = await pool.query('SELECT * FROM equipment ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, type, firma, model, quantity, comment, status, warehouse_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO equipment (id, type, firma, model, quantity, comment, status, warehouse_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET
         type = EXCLUDED.type,
         firma = EXCLUDED.firma,
         model = EXCLUDED.model,
         quantity = EXCLUDED.quantity,
         comment = EXCLUDED.comment,
         status = EXCLUDED.status,
         warehouse_id = EXCLUDED.warehouse_id`,
      [id, type, firma, model, quantity, comment, status, warehouse_id]
    );
    res.status(201).json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, firma, model, quantity, comment, status, warehouse_id } = req.body;
  try {
    await pool.query(
      'UPDATE equipment SET type=$1, firma=$2, model=$3, quantity=$4, comment=$5, status=$6, warehouse_id=$7 WHERE id=$8',
      [type, firma, model, quantity, comment, status, warehouse_id, id]
    );
    res.json({ id: Number(id), ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM equipment WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;