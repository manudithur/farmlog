
export class GroupUpdate {
    updateId: string;
    groupId: string;
    userId: string;
    farmId: string;
    paddockId: string;
    type: string;
    title: string;
    message: string;
    date: Date;
    endDate: Date;

    constructor(updateId: string, groupId: string, userId: string, farmId: string, paddockId: string, type: string, title: string, message: string, date: Date, endDate: Date) {
        this.updateId = updateId;
        this.groupId = groupId;
        this.userId = userId;
        this.farmId = farmId;
        this.paddockId = paddockId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.date = date;
        this.endDate = endDate;
    }

    static fromJson(json: any): GroupUpdate {
        return new GroupUpdate(json.updateId, json.groupId, json.userId, json.farmId, json.paddockId, json.type, json.title, json.message, json.date, json.endDate);
    }
}