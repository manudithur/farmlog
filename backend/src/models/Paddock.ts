import db from '../db/config';

const paddockSchema = new db.Schema({
    paddockId: String,
    farmId: String,
    name: String,
    area: Number,
    liveStockGroupId: String,
    agriculturalProcessId: String,
    crop: String,
    shape: [{ lat: Number, lng: Number }]
});

const Paddock = db.model('Paddock', paddockSchema);

export default Paddock;