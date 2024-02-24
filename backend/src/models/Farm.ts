import db from '../db/config';

const farmSchema = new db.Schema({
    farmId: String,
    name: String,
    ownerId: String,
    location: []
});

const Farm = db.model('Farm', farmSchema);

export default Farm;