/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 22:24:51
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 22:29:36
 * @FilePath: \GEM\libs\comm\src\helper\google\const.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
/*
 * @Author: Cookie
 * @Description: google
 */

import { getConfig } from '@app/common/utils';

const { GOOGLE_CONFIG } = getConfig();

export const GOOGLE_CLIENT_ID = GOOGLE_CONFIG?.CLIENT_ID || 'null';
export const GOOGLE_CLIENT_SECRET = GOOGLE_CONFIG?.CLIENT_SECRETS || 'null';
export const GOOGLE_REDIRECT_URIS = GOOGLE_CONFIG?.REDIRECT_URIS || 'null';
