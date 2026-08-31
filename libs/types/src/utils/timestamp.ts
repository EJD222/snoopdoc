import { type } from 'arktype';

export const Timestamp = type({
    createdAt: 'string.date.parse',
    updatedAt: 'string.date.parse',
    deletedAt: 'string.date.parse | null',
});