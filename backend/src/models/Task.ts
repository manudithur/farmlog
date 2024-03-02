
import db from '../db/config';

const taskSchema = new db.Schema({
    taskId: String,
    userId: String,
    farmId: String,

    assignedTo: [String],

    groupId: String,
    groupName: String,

    paddockId: String,
    paddockName: String,

    title: String,
    message: String,
    dueDate: Date,
    createdDate: Date,

    completed: Boolean,
    completedDate: Date,
    completedMessage: String
});