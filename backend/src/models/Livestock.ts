import db from '../db/config';

const livestockSchema = new db.Schema({
    farmId: String,
    Id: String,
    breed: String,
    birthDate: Date,
    weight: Number,
    healthUpdates: [],
    status: String, // 'alive', 'dead', 'sold', 'sick'
    pregnant: Boolean, 
});

const Livestock = db.model('livestock', livestockSchema);

export default Livestock;