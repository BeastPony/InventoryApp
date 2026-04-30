const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const notebooksRouter = require('./routes/notebooks');
const printersRouter = require('./routes/printers');
const cartridgesRouter = require('./routes/cartridges');
const warehousesRouter = require('./routes/warehouses');
const equipmentRouter = require('./routes/equipment');
const { pingAllPrinters } = require('./services/pingService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/notebooks', notebooksRouter);
app.use('/api/printers', printersRouter);
app.use('/api/cartridges', cartridgesRouter);
app.use('/api/warehouses', warehousesRouter);
app.use('/api/equipment', equipmentRouter);

cron.schedule('*/20 * * * *', () => {
  pingAllPrinters();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});