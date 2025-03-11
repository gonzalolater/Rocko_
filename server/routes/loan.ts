import express from 'express';
import { Response, NextFunction } from 'express';
const router = express.Router();
import { db } from '../db';
import checkJwt from '../auth/checkJwt';
import logger from '../util/logger';

/////////////////// Get loans
router.get('/loans', checkJwt, (req, res, next) => {
  try {
    if (req.user && req.user.id === req.query.user) {
      let sql = `SELECT * FROM loans WHERE user_id = ?`;
      const params = [req.user.id];
      db.query(sql, params, (err, results) => {
        if (err) {
          console.error(err);
          return next(new Error('Database query failed'));
        }
        return res.status(200).json(results);
      })
    } else {
      logger(`401 Unauthorized: Invalid ID ${JSON.stringify({'req.user.id': req?.user?.id, 'req.query.user': req.query.user, jwtValid: req?.user?.id === req.query.user})}`, 'error');
      return res.status(401).send('Unauthorized: Invalid ID');
    }
  } catch (error) {
    logger(error, 'error');;
  }
})


////////////////////  Create a new loan

const loanKillSwitch = (res: Response, next: NextFunction) => {
  try {
    let killSwitch = "SELECT loan_booking_blocked, transactions_blocked FROM platform_status";

    db.query(killSwitch, {}, (err, results) => {
      if (err) {
        console.error(err);
        return next(new Error('Database query failed'));
      }
  
      if (!!results[0].loan_booking_blocked || !!results[0].transactions_blocked) {
        return res.status(503).send('New loans are currently disabled');
      }
    });
  } catch (error) {
    logger(error, 'error');;
  }

}

router.post(
  '/add', checkJwt, (req, res, next) => {
    try {
      if (req.user && Number(req.user.id) == req.body.user) {

        loanKillSwitch(res, next);
  
        let data = {
          user_id: req.user.id,
          transaction_hash: req.body.transaction_hash,
          lending_protocol: req.body.lending_protocol,
          protocol_chain: req.body.protocol_chain,
          loan_active: req.body.loan_active,
          loan_asset: req.body.loan_asset,
          principal_balance: req.body.outstanding_balance,
          outstanding_balance: req.body.outstanding_balance,
          collateral: req.body.collateral,
          collateral_decimals: req.body.collateral_decimals,
          create_time: new Date(),
          modified_time: new Date(),
        };
  
        if (!req.body.exist) { // if new loan on current user
          let sql = "INSERT INTO loans SET ?";
          db.query(sql, data, (err, results) => {
            if (err) {
              console.error(err);
              return next(new Error('Database query failed'));
            }
            return res.send({
              value: results.insertId,
              description: 'Data successfully saved'
            });
          });
        } else { // update loan (add borrowing and collateral)
          let sql = "UPDATE loans SET transaction_hash = ?, outstanding_balance = ?, collateral = ?, modified_time = ? WHERE user_id = ?";
  
          db.query(
            sql, 
            [data.transaction_hash, data.outstanding_balance, data.collateral, data.modified_time, data.user_id], 
            (err, results) => {
            if (err) {
              console.error(err);
              return next(new Error('Database query failed'));
            }

            return res.send({
              value: results.insertId,
              description: 'Data successfully saved'
            });
          });
        }
      } else {
        logger({'req?.user?.id': Number(req?.user?.id), 'req.body.user': req.body.user, jwtValid: Number(req?.user?.id) === req.body.user})
        return res.status(401).send('Unauthorized: Invalid ID');
      }
    } catch (error) {
      logger(error, 'error');
      return res.status(500).send('Something went wrong');
    }

  }
);

//////////////////// Update loan

router.post("/update", checkJwt, (req, res, next) => {
  try {
    if (req?.user?.id && req.body.id) {
      const updateType = req.body.updateType;
  
      if (updateType === "repay") {
        let data = {
          user_id: req.user.id,
          id: req.body.id,
          outstanding_balance: req.body.outstanding_balance,
          interest: req.body.interest,
          loan_active: req.body.loan_active,
          transaction_hash: req.body.transaction_hash,
          modified_time: new Date()
        };
        let sql = "UPDATE loans SET outstanding_balance = ?, interest = ?, loan_active = ?, transaction_hash = ?, modified_time = ? WHERE id = ? AND user_id = ?";
  
        db.query(
          sql, 
          [data.outstanding_balance, data.interest, data.loan_active, data.transaction_hash, data.modified_time, data.id, data.user_id], 
          (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          return res.send("Amount and Active Status successfully updated");
        });
      } else {
        let data = {
          user_id: req.user.id,
          id: req.body.id,
          collateral: req.body.collateral,
          transaction_hash: req.body.transaction_hash,
          modified_time: new Date()
        };
        let sql = "UPDATE loans SET collateral = ?, transaction_hash = ?, modified_time = ? WHERE id = ? AND user_id = ?";
  
        db.query(
          sql, 
          [data.collateral, data.transaction_hash, data.modified_time, data.id, data.user_id],
          (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          return res.send("Buffer, Collateral and LiquidationPrice successfully updated");
        });
      }
    } else {
      logger({'req?.user?.id': req?.user?.id, 'req.body.user': req.body.id, jwtValid: req?.user?.id === req.body.id});
      return res.status(401).send('Unauthorized: Invalid ID');
    }
  } catch (error) {
    logger(error, 'error');
    return res.status(500).send('Something went wrong');
  }

});

export default router;