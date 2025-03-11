import express from 'express';
const router = express.Router();
import { db } from '../db';
import checkJwt from '../auth/checkJwt';
import logger from '../util/logger';

// TODO check that user owns the alert before any actions below
// TODO add user_id to the alerts table

/////////////////// Get Alerts
router.get('/alerts', checkJwt, (req, res, next) => {
  try {
    if(req.user) {
      let sql = `SELECT * FROM alerts WHERE loan_id = ? AND user_id = ?`;
      let params = [req.query.loanId, req.user.id];
  
      db.query(sql, params, (err, results) => {
        if (err) {
          console.error(err);
          return next(new Error('Database query failed'));
        }
        return res.status(200).json(results);
      })
    } else {
      return res.status(401).send('Unauthorized: Cannot get alerts');
    }
  } catch (error) {
    logger(error, 'error');
    return res.status(500).send('Something went wrong');
  }
  
})


////////////////////  Create a new alert

router.post(
  '/addAlert', checkJwt, (req, res, next) => {
    if(req.user) {
      let data = {
        user_id: req.user.id,
        loan_id: req.body.loan_id, 
        alert_type: req.body.alert_type,
        alert_metric: req.body.alert_metric,
        alert_threshold: req.body.alert_threshold,
        alert_email: req.body.alert_email,
        alert_phone: req.body.alert_phone,
        alert_repeat_secs: req.body.alert_repeat_secs,
        alert_once:req.body.alert_once,
        active: req.body.active,        
        create_time: new Date(),
        modified_time: new Date(),
      };

      let sql = "INSERT INTO alerts SET ?";

      db.query(sql, data, (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          return res.send("Alert successfully saved");
      });
    } else {
      return res.status(401).send('Unauthorized: Cannot add alert');
    }
  }
);

//////////////////// Update alert

router.post("/updateAlert", checkJwt, (req, res, next) => {
  if(req.user) {
    let data = {
        id: req.body.id, 
        alert_metric: req.body.alert_metric,
        alert_threshold: req.body.alert_threshold,
        alert_email: req.body.alert_email,
        alert_phone: req.body.alert_phone,
        alert_repeat_secs: req.body.alert_repeat_secs,
        alert_once:req.body.alert_once,
        active: req.body.active,        
        modified_time: new Date(),
    };

    let sql = "UPDATE alerts SET alert_metric = ?, alert_threshold = ?, alert_email = ?, alert_phone = ?, alert_repeat_secs = ?, alert_once = ?, active = ?, modified_time = ? WHERE id = ? AND user_id = ?";

    db.query(
      sql, 
      [data.alert_metric, data.alert_threshold, data.alert_email, data.alert_phone, data.alert_repeat_secs, data.alert_once, data.active, data.modified_time, data.id, req.user.id], 

      (err, results) => {
        if (err) {
          console.error(err);
          return next(new Error('Database query failed'));
        }
        return res.send("Alert successfully updated");
    });
  } else {
    return res.status(401).send('Unauthorized: Cannot update alert');
  }
});

router.post("/deleteAlert", checkJwt, (req, res, next) => {
  if(req.user) {
    let data = {
      id: req.body.id, 
      active: req.body.active,        
      modified_time: new Date(),
    };

    let sql = "UPDATE alerts SET active = ?, modified_time = ? WHERE id = ? AND user_id = ?";

    db.query(sql, [data.active, data.modified_time, data.id, req.user.id], (err, results) => {
        if (err) {
          console.error(err);
          return next(new Error('Database query failed'));
        }
        return res.send("Alert successfully removed");
    });
  } else {
    return res.status(401).send('Unauthorized: Cannot update alert');
  }
})

router.post("/deleteAlertByType", checkJwt, (req, res, next) => {
  if(req.user) {
    let data = {
      alertType : req.body.alertType,   
      active: 0,     
      modified_time: new Date(),
    };

    let sql = "UPDATE alerts SET active = ?, modified_time = ? WHERE alert_type = ? AND user_id = ?";

    db.query(sql, [data.active, data.modified_time, data.alertType, req.user.id], (err, results) => {
        if (err) {
          console.error(err);
          return next(new Error('Database query failed'));
        }
        return res.send("Alerts successfully removed");
    });
  } else {
    return res.status(401).send('Unauthorized: Cannot delete alerts');
  }
})


export default router;
