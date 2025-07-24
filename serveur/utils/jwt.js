import jwt from 'jsonwebtoken';

export function generateToken(user){
    return jwt.sign(
        {
            id:user.id,
            name:user.name,
            role:user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h"}
    );
}