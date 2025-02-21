const jwt = require('jsonwebtoken');
const User = require("../model/user")
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        // Find user with refresh token
        const foundUser = await User.findOne({ refreshToken: refreshToken });
        if (!foundUser) return res.sendStatus(403);

        // Verify refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username) {
                    return res.sendStatus(403);
                }

                const roles = Object.values(foundUser.roles).filter(Boolean);
                
                // Create new access token
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: decoded.username,
                            email: decoded.email,
                            roles: roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '180d' }
                );

                res.json({ 
                    email: foundUser.email, 
                    roles, 
                    accessToken 
                });
            }
        );
    } catch (err) {
        // console.error('Refresh token error:', err);
        return res.sendStatus(500);
    }
}

module.exports = { handleRefreshToken };
