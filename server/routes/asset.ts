import express from 'express';
const router = express.Router();
import { db } from '../db';
import logger from '../util/logger';

/////////////////// Get loans
router.get('/average_apr', (req, res, next) => {
  try {
    let params = []
    const network = req.query.network || 'mainnet';
    // console.log({network})
    let sql;
      if (req.query.openDate === "month") {
        sql = `SELECT AVG(borrow_apr) AS average_apr FROM asset_data WHERE fetch_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND network = ?`;
      } else if (req.query.openDate === "threemonth") {
        sql = `SELECT AVG(borrow_apr) AS average_apr FROM asset_data WHERE fetch_time >= DATE_SUB(NOW(), INTERVAL 90 DAY) AND network = ?`;
      } else if (req.query.openDate === "year") {
        sql = `SELECT AVG(borrow_apr) AS average_apr FROM asset_data WHERE fetch_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND network = ?`;
      } else if (req.query.openDate) {
        sql = `SELECT AVG(borrow_apr) AS average_apr FROM asset_data WHERE fetch_time >= ? AND network = ?`;
        params.push(req.query.openDate);
      } else {
        return res.status(400).send("Query param 'openDate' required");
      }
  
      db.query(sql, [...params, network], (err, results) => {
        if (err) {
          console.error(err);
          return next(new Error('Database query failed'));
        }
        // console.log({results})
        return res.status(200).json({
          average_apr: results?.[0].average_apr,
          network
        });
      })
  } catch (error) {
    logger(error, 'error');
    return res.status(500).send('Something went wrong');
  }
  
})

router.get('/average_reward_rate', (req, res, next) => {
  try {
    const network = req.query.network || 'mainnet';
    let sql = `SELECT AVG(borrow_reward_rate) AS average_reward_rate FROM asset_data WHERE fetch_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND network = ?`;

    db.query(sql, [network], (err, results) => {
      if (err) {
        console.error(err);
        return next(new Error('Database query failed'));
      }
      return res.status(200).json({
        average_reward_rate: results?.[0].average_reward_rate,
        network
      });
    })
  } catch (error) {
    logger(error, 'error');
    return res.status(500).send('Something went wrong');
  }

})

router.get('/reward_rate', (req, res, next) => {
  try {
    const network = req.query.network || 'mainnet';
    let sql = `SELECT borrow_reward_rate FROM asset_data WHERE network = ? ORDER BY fetch_time DESC LIMIT 1`;

    db.query(sql, [network], (err, results) => {
      if (err) {
        console.error(err);
        return next(new Error('Database query failed'));
      }
      return res.status(200).json({
        borrow_reward_rate: results?.[0].borrow_reward_rate,
        network
      });
    })
  } catch (error) {
    logger(error, 'error');
    return res.status(500).send('Something went wrong');
  }

})

export default router;
