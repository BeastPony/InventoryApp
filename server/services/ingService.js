const { exec } = require('child_process');
const { promisify } = require('util');
const pool = require('../db');

const execPromise = promisify(exec);

// Мягкая задержка между пингами, чтобы не загружать сеть
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Пингует указанный IP и возвращает true, если хост доступен
 */
async function pingHost(ip) {
  try {
    const cmd = process.platform === 'win32'
      ? `ping -n 1 -w 2000 ${ip}`
      : `ping -c 1 -W 2 ${ip}`;
    const { stdout } = await execPromise(cmd);
    // Успешный пинг в Windows содержит 'TTL=', в Linux '1 packets transmitted, 1 received'
    if (process.platform === 'win32') {
      return /TTL=/i.test(stdout);
    } else {
      return /1 packets transmitted, 1 received/.test(stdout);
    }
  } catch (err) {
    return false;
  }
}

/**
 * Основная функция – выполняет пинг всех принтеров,
 * которые не помечены как "offline" или "broken"
 */
async function pingAllPrinters() {
  console.log('[PingService] Starting printer ping round...');
  try {
    // Получаем принтеры, которые участвуют в автообновлении
    const res = await pool.query(
      `SELECT id, ip_address FROM printers
       WHERE ip_address IS NOT NULL
         AND ip_address <> ''
         AND status NOT IN ('offline', 'broken')`
    );

    for (const printer of res.rows) {
      const online = await pingHost(printer.ip_address);
      const newStatus = online ? 'active' : 'maintenance';

      await pool.query(
        'UPDATE printers SET status = $1 WHERE id = $2',
        [newStatus, printer.id]
      );

      console.log(`Printer ${printer.ip_address} -> ${online ? 'ONLINE' : 'OFFLINE'} (new status: ${newStatus})`);
      await delay(300); // 300 мс между пингами
    }

    console.log('[PingService] Round finished.');
  } catch (err) {
    console.error('[PingService] Error:', err.message);
  }
}

module.exports = { pingAllPrinters, pingHost };