import { Strategy } from 'passport-local';
import { compare } from 'bcrypt';
import boom from "@hapi/boom";

import { login } from '../controller/user';

const local = new Strategy(async (username, password, done) => {
    try {
        const user = await login({ email: username });
        if (!user) return done(boom.forbidden(), false);
        const isMatch = await compare(password, user.password);
        if (!isMatch) return done(boom.forbidden("usuario y contraseñas incorrectos"), false);
        return done(null, user);
    } catch (error) {
        done(error, false);
    }
});

export default local;
