import { Request, Response } from 'express';

import express from 'express';
import complianceCheckAddress from '../util/complianceCheckAddress';
import complianceTransaction, { TransferType, Blockchain } from '../util/complianceTransaction';
import { db } from '../db';
import checkJwt from '../auth/checkJwt';
import logger from '../util/logger';
const router = express.Router();

enum FundingSource {
    ExchangeOAuth = 'exchange_oauth',
    ConnectedWallet = 'connected_wallet',
    ExternalTransfer = 'external_transfer'

}

enum FundingSourceUI {
    Default = 'default',
    Ethereum = 'ethereum',
    Other = 'other'
}

enum TransactionType {
    NewLoanWithdrawl = 'new_loan_withdrawal', 
    Payment = 'payment', 
    InitialCollateral = 'initial_collateral', 
    CollateralAddition = 'collateral_addition', 
    CollateralWithdrawal = 'collateral_withdrawal', 
    LoanIncrease = 'loan_increase', 
    RewardsWithdrawal = 'rewards_withdrawal', 
    Fee = 'fee'
}


router.post('/address', checkJwt, async (req: Request, res: Response, next) => {
    try {
        // address check
        if(req.body.address){
            let isCompliant = false;
            try {
                const complianceCheckAddressResult = await complianceCheckAddress(req.body.address);

                isCompliant = complianceCheckAddressResult;
            } catch (e) {
                logger(e, 'error');
                return res.status(502).send('Something went wrong');
            }

            const addressCompQuery = "INSERT INTO compliance_address (wallet_address, user_id, user_email, is_ofac_compliant, create_time) VALUES (?, ?, ?, ?, ?)";
            const addressParams = [req.body.address, req?.user?.id, req?.user?.email, isCompliant, new Date()];

            db.query(addressCompQuery, addressParams, (err, results) => {
                if (err) {
                    console.error(err);
                    return next(new Error('Failed to insert into compliance_address'));
                }

                if ( 
                    isCompliant
                ) {
                    return res.status(200).send('OK');
                } else {            
                    // block user
                    let sql = "UPDATE users SET inactive = ?, modified_time = ? WHERE email = ?";
                    const params = [1, new Date(), req?.user?.email];
                    db.query(sql, params, (err: any, results: any) => {
                        if (err) {
                        console.error(err);
                        return next(new Error('Database query failed'));
                        }
                        return res.status(401).send('Unauthorized');
                    });
                }
            });            
        } else {
            return res.status(400).send('Bad Request: Missing address');
        }
    } catch (error) {
        logger(error, 'error');
        return res.status(500).send('Something went wrong');
    }
});

router.post('/transaction', checkJwt, async (req: Request, res: Response, next) => {
    if(req?.user?.id && req.body) {
        try{
            const transactionTypeCompliance = {
                [TransactionType.NewLoanWithdrawl]: TransferType.CryptoWithdrawal,
                [TransactionType.Payment]: TransferType.CryptoDeposit,
                [TransactionType.InitialCollateral]: TransferType.CryptoDeposit,
                [TransactionType.CollateralAddition]: TransferType.CryptoDeposit,
                [TransactionType.CollateralWithdrawal]: TransferType.CryptoWithdrawal,
                [TransactionType.LoanIncrease]: TransferType.CryptoWithdrawal,
                [TransactionType.RewardsWithdrawal]: TransferType.CryptoWithdrawal,
                [TransactionType.Fee]: TransferType.CryptoDeposit
            }
            // TODO move decimal conversion to client, server should only handle wei values
            const assetAmount = req.body.metadata.amount * (10**req.body.metadata.asset_decimals);
            let complianceSubmission: { uuid: string; } | undefined;
            try {
                complianceSubmission = await complianceTransaction({
                    rockoUserId: req?.user?.id.toString(),
                    asset: req.body.metadata.asset,
                    assetAmount: assetAmount.toString(),
                    chain: Blockchain.Ethereum,
                    destinationAddress: req.body.metadata.recipient_address,
                    txHash: req.body.transaction_hash,
                    transferType: transactionTypeCompliance[req.body.metadata.transaction_type as TransactionType],
                    usdValue: Number(req.body.metadata.usd_value).toFixed(2).toString(),
                    network: req.body.network
                })

            } catch (e) {
                logger(e, 'error');
            }

            const source = {
                [FundingSourceUI.Default]: FundingSource.ExchangeOAuth,
                [FundingSourceUI.Ethereum]: FundingSource.ConnectedWallet,
                [FundingSourceUI.Other]: FundingSource.ExternalTransfer
            };
        
            let data = {
                compliance_id: complianceSubmission?.uuid,
                user_id: req?.user?.id,
                loan_id: req.body.metadata.loan_id,
                asset: req.body.metadata.asset,
                asset_decimals: req.body.metadata.asset_decimals,
                amount: assetAmount,
                usd_value: req.body.metadata.usd_value,
                recipient_address: req.body.metadata.recipient_address,
                sender_address: req.body.metadata.sender_address,
                transaction_hash: req.body.transaction_hash,
                transaction_type: req.body.metadata.transaction_type,
                funding_source: source[req.body.metadata.funding_source as FundingSourceUI],
                create_time: new Date(),
            };
           
            const txMonQuery = "INSERT INTO transactions SET ?";
            
            db.query(txMonQuery, data, (err, results) => {
                if (err) {
                    console.error(err);
                    return next(new Error('Failed to insert into compliance_transaction'));
                }
        
                console.log("compliance_transaction updated successfully");
                            
                if(req.body.transaction_hash && complianceSubmission?.uuid){
                    return res.send('OK');
                } else {
                    return res.status(400).send('Bad Request: Missing tx hash');
                }

            });

           } catch (error) {
               logger(error, 'error');
               return res.status(500).send('Something went wrong');
           }
    } else {
        return res.status(400).send('Bad Request: Missing payload');
    }

});
  

router.get('/platform-status', async (req: Request, res: Response, next) => {
    try {
        let killSwitch = "SELECT loan_booking_blocked, transactions_blocked, status_message FROM platform_status";

        db.query(killSwitch, {}, (err, results) => {
          if (err) {
            console.error(err);
            return next(new Error('Database query failed'));
          }
          if (results[0].loan_booking_blocked || results[0].transactions_blocked) {
            return res.status(503).send(results[0]);
          }
    
          return res.status(200).send(results[0]);
        });
    } catch (error) {
        logger(error, 'error');
        return res.status(500).send('Something went wrong');
    }

})

export default router;
