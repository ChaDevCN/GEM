/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 15:07:24
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 22:32:52
 * @FilePath: \GEM\libs\comm\src\helper\index.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { IPaginationOptions, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { defaultPaginationParams, MAX_PAGE_SIZE } from './constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class CustomPaginationMeta {
	constructor(
		public readonly pageSize: number,
		public readonly totalCounts: number,
		public readonly totalPages: number,
		public readonly currentPage: number
	) {}
}

export const getPaginationOptions = (
	page: PaginationParams = {
		currentPage: defaultPaginationParams.currentPage,
		pageSize: defaultPaginationParams.pageSize
	}
) => {
	const limit = page.pageSize > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : page.pageSize;

	const options: IPaginationOptions<CustomPaginationMeta> = {
		page: page.currentPage,
		limit,
		metaTransformer: (meta: IPaginationMeta): CustomPaginationMeta => {
			return new CustomPaginationMeta(
				meta.itemCount,
				meta.totalItems,
				meta.totalPages,
				meta.currentPage
			);
		}
	};
	return options;
};

export const PayloadUser = createParamDecorator(
	(data, ctx: ExecutionContext): IPayloadUser => {
		const request = ctx.switchToHttp().getRequest();
		if (request.user) {
			return request.user;
		} else {
			return {
				userId: 1,
				username: 'charlie',
				name: 'charlie',
				email: 'charlie.l1u@outlook.com'
			};
		}
	}
);
