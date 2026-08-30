export type TBrand<t = unknown, id = unknown> = t & {
    readonly [' brand']: [t, id];
};