import { QuestValidator } from "./protocol";
import { QuestType } from "../model/schema";

export class DailyValidator implements QuestValidator {    
    questType: QuestType = "daily";
    async validate(questId: string): Promise<boolean> {
        // Implement social quest validation logic here
        return true;
    }
    async getPoint(questId: string): Promise<number> {
        return 10;
    }
}