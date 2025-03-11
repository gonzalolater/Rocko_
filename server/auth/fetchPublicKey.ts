import { JwksClient } from 'jwks-rsa';

export const fetchPublicKey = async ({
    environmentId,
    aud = 'https://app.dynamicauth.com',
  }: {
    environmentId: string;
    aud?: string;
  }) => {
    const client = new JwksClient({
      jwksUri: `${aud}/api/v0/sdk/${environmentId}/.well-known/jwks`,
    });
    const signingKey = await client.getSigningKey();
    const publicKey = signingKey.getPublicKey();
    return publicKey;
  };
