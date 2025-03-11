## Getting Started

This project is a Next.js app that uses TypeScript, React, and Tailwind CSS. It is a web application that allows users to interact with the blockchain and perform various actions such as borrowing, lending, and trading.

Install Node v20.x and Yarn if you haven't already:

## Environment variables

- [NEXT_PUBLIC_IS_DEMO_MODE] : if true, app will run in demo mode - otherwise(false), it will run in real mode

- [NEXT_PUBLIC_NETWORK] : Blockchain network which application will run on. `sepolia, mainnet, etc`

- [NEXT_PUBLIC_INFURA_APIKEY] : This is used to communicate with the Ethereum blockchain - infuraProvider will be used as wagmi provider

- [NEXT_PUBLIC_THIRDWEB_CLIENTID] : Used to access the enabled thirdweb infrastructure services and identify your application using an app bundle ID

- [NEXT_PUBLIC_ZERODEV_PROJECT_ID] : This is for ZeroDev dashboard configuration. Auth0 settings, whitelisted domains and Gas policies will be included in ZeroDev dashboard configuration.

- [NEXT_PUBLIC_BACKEND_URL] : Server URL

- [NEXT_PUBLIC_COINBASE_CLIENT_ID] : Coinbase client ID for Coinbase wallet integration

- [NEXT_PUBLIC_PAYMENT_BUFFER] : Payment buffer for interest accrual

- [SLACK_WEBHOOK_URL] : Slack webhook URL for error logging

Create your own .env.local file in the root directory of the project and add the following environment variables:

```
NEXT_PUBLIC_IS_DEMO_MODE=false
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_INFURA_APIKEY=ask_for_it
NEXT_PUBLIC_THIRDWEB_CLIENTID=ask_for_it
NEXT_PUBLIC_ZERODEV_PROJECT_ID=ask_for_it
NEXT_PUBLIC_BACKEND_URL=https://backend.dev.rocko.cloud
NEXT_PUBLIC_COINBASE_CLIENT_ID=ask_for_it
NEXT_PUBLIC_PAYMENT_BUFFER=5
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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

NEXT_PUBLIC_FLAG_USD_LOANS=true
NEXT_PUBLIC_FLAG_MULTI_COLLATERAL=true
NEXT_PUBLIC_FLAG_MULTI_PROTOCOL=true
NEXT_PUBLIC_FLAG_COINBASE_FUNDING=true
NEXT_PUBLIC_FLAG_OTHER_EXCHANGE_FUNDING=true
NEXT_PUBLIC_FLAG_SMS_ALERTS=true
NEXT_PUBLIC_PHONE_EMAIL_PASS_SETTINGS=true
```

## Running the app

First, run the development server:

```bash
- [install packages] yarn install
- [start] yarn dev
- [build] yarn build
- [eslint fix] yarn eslint:fix
```

## Opening a PR

Once work is completed and ready for a PR, please make sure to run `yarn build` and `yarn eslint:fix` before opening a PR. This will ensure the build is working and wont fail the Netlify build.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
