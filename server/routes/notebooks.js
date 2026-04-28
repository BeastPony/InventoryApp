const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notebooks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, inv_number, computer_name, current_user_name, location, service_tag, model, status } = req.body;
  try {
    await pool.query(
      `INSERT INTO notebooks (id, inv_number, computer_name, current_user_name, location, service_tag, model, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET
         inv_number = EXCLUDED.inv_number,
         computer_name = EXCLUDED.computer_name,
         current_user_name = EXCLUDED.current_user_name,
         location = EXCLUDED.location,
         service_tag = EXCLUDED.service_tag,
         model = EXCLUDED.model,
         status = EXCLUDED.status`,
      [id, inv_number, computer_name, current_user_name, location, service_tag, model, status]
    );
    res.status(201).json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { inv_number, computer_name, current_user_name, location, service_tag, model, status } = req.body;
  try {
    await pool.query(
      'UPDATE notebooks SET inv_number=$1, computer_name=$2, current_user_name=$3, location=$4, service_tag=$5, model=$6, status=$7 WHERE id=$8',
      [inv_number, computer_name, current_user_name, location, service_tag, model, status, id]
    );
    res.json({ id: Number(id), ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notebooks WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;