import { string } from 'joi';
import db from '../db/config';

const groupSchema = new db.Schema({
    name: String,
    groupId: String,
    farmId: String,
    currentPadockId: String,
    liveStockCount: Number,
    lastUpdated: Date,
    isActive: Boolean
});

const Group = db.model('Group', groupSchema);

export default Group;