import { model, Schema } from "mongoose";
import { hash } from 'bcrypt';

export interface IUser {
    _id: Schema.Types.ObjectId,
    name: string;
    email: string,
    password: string,
    createdAt: Date,
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true,
        default: "",
        minlength: 3,
        maxlength: 40
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
        minlength: 8,
        maxlength: 40
    }
}, { timestamps: { createdAt: true } });

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next(); // is la contraseña no ha sido modificada
    this.password = await hash(this.password, 10);
    next();
});

const User = model("user", userSchema);

export default User;
