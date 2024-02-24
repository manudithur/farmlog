import db from '../db/config';

const userSchema = new db.Schema({
    userId: String,
    role: String,
    farmId: String,
    email: String,
    password: String,

    name: {
        first: String,
        last: String
    }
});

const User = db.model('User', userSchema);

export default User;