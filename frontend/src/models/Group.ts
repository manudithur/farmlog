
export class Group {
    name: string;
    groupId: string;
    farmId: string;
    currentPadockId: string;
    liveStockCount: Number;
    lastUpdated: Date;
    isActive: Boolean;

    constructor(name: string, groupId: string, farmId: string, currentPadockId: string, liveStockCount: Number, lastUpdated: Date, isActive: Boolean) {
        this.name = name;
        this.groupId = groupId;
        this.farmId = farmId;
        this.currentPadockId = currentPadockId;
        this.liveStockCount = liveStockCount;
        this.lastUpdated = lastUpdated;
        this.isActive = isActive;
    }

    static fromJson(data: any): Group {
        return new Group(data.name, data.groupId, data.farmId, data.currentPadockId, data.liveStockCount, data.lastUpdated, data.isActive);
    }

}