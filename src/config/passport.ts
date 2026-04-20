import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from './client';

// Local strategy configuration
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            // Find user by either username or email
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: username },
                        { email: username }
                    ]
                }
            });

            if (!user) {
                return done(null, false, { message: 'Incorrect username or email.' });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // Successful login, return user but exclude password
            const { password: _, ...userWithoutPassword } = user;
            return done(null, userWithoutPassword);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user into the session
passport.serializeUser((user: any, done) => {
    // We can store just the BigInt ID but Express session expects string, so we convert it
    done(null, user.id.toString());
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: BigInt(id)
            }
        });
        if (user) {
            const { password, ...userWithoutPassword } = user;
            done(null, userWithoutPassword);
        } else {
            done(new Error("User not found"), null);
        }
    } catch (err) {
        done(err, null);
    }
});

export default passport;
