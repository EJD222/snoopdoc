import { type } from "arktype";

export const PaginationQuery = type({
    'page?': type('number').atLeast(1),
    'pageSize?': type('number').atLeast(1).atMost(100),
    'cursor?': type({
        createdAt: 'string.date.parse',
        id: 'string',
    }),
})

export type TPaginationResult<T> = {
    total: number
    pageSize: number
    hasMore: boolean
    nextCursor?: {
        createdAt: string
        id: string
    }
    data: T[]
}