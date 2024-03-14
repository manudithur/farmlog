import db from '../db/config';

const fieldSchema = new db.Schema({
    fieldId: String,
    farmId: String,
    name: String,
    area: Number,
    crop: String,
    shape: [{ lat: Number, lng: Number }],
    center: { lat: Number, lng: Number }
});

const field = db.model('field', fieldSchema);

export default field;