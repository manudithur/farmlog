import db from '../db/config';
import Group from './Group';

const groupUpdateSchema = new db.Schema({
    updateId: String,
    groupId: String,
    userId: String,
    farmId: String,
    paddockId: String,

    type: String, // 'movement', 'health',  'death', 'birth'

    title: String,
    message: String,
    date: Date,

    endDate: Date,
});

const GroupUpdate = db.model('Update', groupUpdateSchema);
export default GroupUpdate;