import { Schema } from "mongoose";

export type Timezone = {
    name: string;
    offset: string;
};


export const TimezoneSchema: Schema = new Schema({
    name: { type: String, required: true },
    offset: { type: String, required: true},
  });