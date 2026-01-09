import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../dto/pagination.dto';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationQuery: PaginationQueryDto,
): Promise<PaginatedResponseDto<T>> {
  const page = paginationQuery.page ?? 1;
  const limit = paginationQuery.limit ?? 10;

  const [data, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  const totalPages = Math.ceil(total / limit);

  const meta: PaginationMetaDto = {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };

  return { data, meta };
}
