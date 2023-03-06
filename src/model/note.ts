import { model, Schema } from "mongoose";

export interface INote {
    _id?: any,
    title: string;
    description: string;
    idUser?: Schema.Types.ObjectId;
    isDraft: boolean;
    createAt?: any;
};

const noteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isDraft: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: true } });

const Note = model("note", noteSchema);

export default Note;
