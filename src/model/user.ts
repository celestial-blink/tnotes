import { model, Schema } from "mongoose";
import { hash } from 'bcrypt';

export interface IUser {
    _id: Schema.Types.ObjectId,
    name: string;
    lastname: string,
    email: string,
    password: string,
    createdAt: Date,
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true,
        default: "",
        maxlength: 30
    },
    lastname: {
        type: String,
        trim: true,
        default: "",
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: [8, "Minino 8 caracteres"],
    }
}, { timestamps: { createdAt: true } });

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await hash(this.password, 10);
    next();
})

const User = model("user", userSchema);

export default User;
