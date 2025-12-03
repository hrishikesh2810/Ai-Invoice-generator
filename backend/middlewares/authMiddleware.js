const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            //Get token from header
            token = req.headers.authorization.split(' ')[1];

            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user from token
            const { data: user, error } = await supabase
                .from('users')
                .select('id, name, email, business_name, address, phone')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                throw new Error("User not found");
            }

            req.user = user;
            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};
module.exports = { protect };