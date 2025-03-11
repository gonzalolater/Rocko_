import axios from 'axios';
import { CLIENT_URL, SLACK_WEBHOOK_URL } from '../constants';

type LogLevel = 'info' | 'error' | 'warn';

const messageCleaner = (message: string): string =>
  message
    .replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
      'redacted@user.email',
    )
    .replace(/Bearer\s[^\s]+/gi, 'Bearer [REDACTED]"')
    .replace(
      /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|[0-9a-fA-F]{1,4}:([0-9a-fA-F]{1,4}:){1,4}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi,
      'redacted.ip.address.',
    );

const logger = async (message: any, level: LogLevel = 'info') => {

  // this should be the NODE_END but its undefined ¯\_(ツ)_/¯
  if (CLIENT_URL === "https://app.rocko.co" || CLIENT_URL === "https://develop.testnet.rocko.co") {
     // Also log to stdout
     console.log({ message, level });

     message = JSON.stringify(message, null, 2);
  
     if (SLACK_WEBHOOK_URL) {
       try {
   
         await axios
           .post(
             SLACK_WEBHOOK_URL,
             {
               text: `${level.toUpperCase()}: ${message}`,
             },
             {
               headers: {
                 'Content-Type': 'application/json',
               },
             },
           )
           .then((response) => {
             console.log('Message sent successfully:', response.data);
           })
           .catch((error) => {
             console.error('Error sending message:', error);
           });
       } catch (error) {
         // eslint-disable-next-line no-console
         console.error(error);
       }
     }
  } else {
       // eslint-disable-next-line no-console
       console.log({ message, level });
  }
};

export default logger;
