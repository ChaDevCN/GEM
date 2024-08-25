/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 22:24:51
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 22:27:24
 * @FilePath: \GEM\libs\comm\src\helper\google\auth.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { GOOGLE_CLIENT_ID } from './const';

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

/**
 * @description: 验证GoogleID
 */
export const getGoogleUser = async ({ code }) => {
  const { tokens } = await client.getToken({
    code,
    client_id: GOOGLE_CLIENT_ID,
  });
  console.log('tokens=====>', tokens);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log('payload===>', payload);
  return payload;
};
