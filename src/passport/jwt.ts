import JwtStrategy, { StrategyOptions } from 'passport-jwt';
import { env } from 'process';

const opts: StrategyOptions = {
    jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
}

const jwt = new JwtStrategy.Strategy(opts, (payload, done) => {
    return done(null, payload);
});

export default jwt;
