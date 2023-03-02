import { model, Schema } from "mongoose";

interface INote {
    title: string;
    description: string;
    idUser: Schema.Types.ObjectId;
    isDraft: boolean;
    createAt: Date;
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

const note = model("note", noteSchema);

export default note;