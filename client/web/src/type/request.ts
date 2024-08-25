/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-25 10:57:44
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 11:00:20
 * @FilePath: \GEM\client\web\src\type\request.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
export type RequestResponse<T> = {
	status: number;
	message: string;
	success: boolean;
	data: T;
};
