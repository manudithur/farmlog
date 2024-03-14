import db from '../db/config';

const farmSchema = new db.Schema({
    farmId: String,
    name: String,
    ownerId: String,
    center: {lat: Number, lng: Number},
});

const Farm = db.model('Farm', farmSchema);

export default Farm;