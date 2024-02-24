import db from '../db/config';

const groupSchema = new db.Schema({
    name: String,
    groupId: String,
    farmId: String,
    currentPadockId: String,
    liveStock: [],
    updates: [],
});

const Group = db.model('Group', groupSchema);

export default Group;