import { QuestType } from "../model/schema";

export interface QuestValidator {
    questType: QuestType;
    validate(questId: string): Promise<boolean>;
    getPoint(questId: string): Promise<number>;
}