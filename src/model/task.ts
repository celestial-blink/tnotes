import { model, Schema } from "mongoose";

export interface ITask {
    _id: Schema.Types.ObjectId;
    idUser: Schema.Types.ObjectId;
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    endDate: Date | null;
    createAt: Date;
}

const taskSchema = new Schema<ITask>({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
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
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    endDate: {
        type: Date,
        default: null
    }
}, { timestamps: { createdAt: true } });

const Task = model("task", taskSchema);

export default Task;
