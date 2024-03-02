import db from '../db/config';

const livestockSchema = new db.Schema({
    farmId: String,
    Id: String,
    breed: String,
    gender: String, //male or female
    birthDate: Date,
    weight: Number,
    status: String, // 'alive', 'dead', 'sold', 'sick'
    pregnant: Boolean, 
});

const Livestock = db.model('livestock', livestockSchema);

export default Livestock;