/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 20:05:55
 * @FilePath: \GEM\libs\comm\src\exceptions\http.exception.filter.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { BusinessException } from './business.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const status = exception.getStatus();

		// 处理业务异常
		if (exception instanceof BusinessException) {
			const error = exception.getResponse();
			response.status(HttpStatus.OK).json({
				data: null,
				status: error['code'],
				extra: {},
				message: error['message'],
				success: false
			});
			return;
		}

		const exceptionResponse = exception.getResponse();
		let message = (exceptionResponse as any).message || exceptionResponse;

		if (typeof message === 'object' && message.message) {
			message = message.message;
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message
		});
	}
}
