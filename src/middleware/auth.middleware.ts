import { Request, Response, NextFunction } from 'express';

// Check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // If it's an API request, return 401
    if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    // Otherwise redirect to login page
    res.redirect('/login');
};

// Check if user has required roles
export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            if (req.originalUrl.startsWith('/api')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            return res.redirect('/login');
        }

        const user = req.user as any;
        if (user && roles.includes(user.role)) {
            return next();
        }

        // If user doesn't have role
        if (req.originalUrl.startsWith('/api')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.status(403).send('Forbidden: Access Denied.');
    };
};
