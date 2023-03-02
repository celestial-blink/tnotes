import { model, Schema } from "mongoose";

interface ITask {
    title: string;
    description: string;
    idUser: Schema.Types.ObjectId;
    isDraft: boolean;
    createAt: Date;
}

const taskSchema = new Schema<ITask>({
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

const task = model("task", taskSchema);

export default task;