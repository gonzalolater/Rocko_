import { BLACKLIST_COUNTRY_CODES, VPNAPI_KEY } from "../constants";

import express from 'express';
const router = express.Router();
import { db } from '../db';
import axios from 'axios';
import checkJwt from "../auth/checkJwt";
import logger from "../util/logger";
import { getAddress } from "ethers";

router.post(
    '/addUser', checkJwt, async (req, res, next) => {
      if (req.user && req.user?.email === req.body?.email) {
        try {
          let data = {
            email: req.body.email,
            wallet_address: req.body.wallet_address,
            country_origin: req.body.country,
            ipaddress_lastlogin: req.body.ip,
            inactive: req.body.inactive,
            create_time: new Date(),
            modified_time: new Date(),
          };
          let validAddress: string = "";
  
          try {
            validAddress = getAddress(req.body.wallet_address);
          } catch (error) {
            logger(error, 'error');
            return res.status(400).send('Invalid wallet address');
          }

          if (req.body.email && validAddress) {
            let sql = `SELECT * FROM users WHERE email = ? OR wallet_address = ?`;
            const params = [req.body.email, validAddress];

            db.query(sql, params, (err, results) => {
                if (err) {
                  console.error(err);
                  return next(new Error('Database query failed'));
                }
      
                if (results.length > 0) {
                  logger(`Attempted to create duplicate user email (${req.body.email.replace("@", "(at)")}) or wallet_address (${req.body.wallet_address})`, 'error')
                  return res.status(403).send('Cannot create user');
                } else {
                  let sql = "INSERT INTO users SET ?";

                  // @ts-ignore
                  db.query(sql, data, (err, results) => {
                    if (err) {
                      console.error(err);
                      return next(new Error('Database query failed'));
                    }
   
                    return res.send("Data successfully saved in users table!");
                  });
                }
            })
          } 
        } catch (error) {
         logger(error, 'error'); 
        }
      } else {
        return res.status(401).send('Unauthorized');
      }
    }
);
  
router.post(
  '/updateUser', checkJwt, (req, res, next) => {
    try {
      if (req.user && req.user.email === req.body.email) {
        let data = {
          email: req.user.email,
          phone: req.body.phone,
          modified_time: new Date(),
        };
        let sql = "UPDATE users SET phone = ?, modified_time = ? WHERE email = ?";
    
        db.query(sql, [data.phone, data.modified_time, data.email], (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          return res.send("User's Phone data successfully updated");
        });
      } else {
        return res.status(401).send('Unauthorized: Invalid email');
      }
    } catch (error) {
      logger(error, 'error');
    }
  }
);

router.patch(
  '/updateCountry', checkJwt, (req, res, next) => {
    if (req.user && req.user.email === req.body?.email) {
      try {
        if (req.body.email) {
          let data = {
            email: req.body.email,
            country: req.body.country,
            ip: req.body.ip,
            modified_time: new Date(),
          };
          let sql = "UPDATE users SET country_lastlogin = ?, ipaddress_lastlogin = ?, modified_time = ? WHERE email = ?";
      
          db.query(sql, [data.country, data.ip, data.modified_time, data.email], (err, results) => {
            if (err) {
              console.error(err);
              return next(new Error('Database query failed'));
            }
            return res.status(200).send("OK");
          });
        } else {
          return res.status(400).send('Bad Request: Missing email');
        }
      } catch (error) {
        logger(error, 'error');
      }
    } else {
      return res.status(401).send('Unauthorized');
    }
  }
);

// Get all users

router.post('/users', checkJwt, (req, res, next) => {
  try{
    if (req.user && req.user.email === req.body.email) {
      let sql = `SELECT * FROM users WHERE email = ?`;
      const params = [req.user.email];
      db.query(sql, params, (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          return res.status(200).json(results);
      })
    } else {
      return res.status(401).send('Unauthorized: Invalid email');
    }
  } catch(error) {
    logger(error, 'error');
  }

})

// Get user id

router.post('/userid', checkJwt, (req, res, next) => {
  try {
    if (req.user && req.user.email === req.body.email) {
      let sql = `SELECT id FROM users WHERE email = ?`;
      const params = [req.user.email];
      db.query(sql, params, (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          return res.status(200).json(results);
      })
  } else {
    return res.status(401).send('Unauthorized: Invalid email');
  }
  } catch (error) {
    logger(error, 'error');
  }
})

// TODO move to compliance router
// Get User IP
const VPNAPI_URL = 'https://vpnapi.io/api';
const blacklist_country_code = BLACKLIST_COUNTRY_CODES;

router.post('/vpn', async (req, res) => {
  try {
    const ip = req.body.ip;
    const response = await axios.get(`${VPNAPI_URL}/${ip}?key=${VPNAPI_KEY}`);

    const { security, location } = response.data;

    if (blacklist_country_code.includes(location.country_code)) {
      res.status(403).send('Failed region/vpn test');
    } else {
      if ( security.vpn === false &&
        security.proxy === false &&
        security.tor === false &&
        security.relay === false 
      ) {
        res.status(200).send({
          description: 'No VPN, Proxy, Tor, or Relay detected',
          details: {
            ip: req.body.ip,
            country: location.country
          }
        });
      } else {
        return res.status(403).send('VPN, Proxy, Tor, or Relay detected');
      }
    }
  } catch (error) {
    logger(error, 'error');
    return res.status(403).send('Failed region/vpn test');
  }
})

export default router;
