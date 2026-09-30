import {z} from "zod";
export const defaultOrder=["workout","photo","invest","journal","timeline","tools","settings"] as const;
export type AppKey=typeof defaultOrder[number];
export const orderSchema=z.array(z.enum(defaultOrder)).length(defaultOrder.length).refine(v=>new Set(v).size===defaultOrder.length);
