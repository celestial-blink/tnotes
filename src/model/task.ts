import { model, Schema } from "mongoose";

export interface ITask {
    _id?: any,
    title?: string;
    description?: string;
    idUser?: Schema.Types.ObjectId;
    isDraft?: boolean;
    createAt?: any;
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

const Task = model("task", taskSchema);

export default Task;
