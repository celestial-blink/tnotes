import { model, Schema } from "mongoose";

export interface INote {
    _id: Schema.Types.ObjectId;
    idUser: Schema.Types.ObjectId;
    title: string;
    description: string;
    isDraft: boolean;
    createAt: Date;
};

const noteSchema = new Schema<INote>({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
        maxlength: 120
    },
    description: {
        type: String,
        maxlength: 500
    },
    isDraft: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: true } });

const Note = model("note", noteSchema);

export default Note;
