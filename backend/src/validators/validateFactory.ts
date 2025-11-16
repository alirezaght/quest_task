import { QuestType } from "../model/schema";
import { DailyValidator } from "./dailyValidator";
import { QuestValidator } from "./protocol";
import { SocialValidator } from "./socialValidator";

export class ValidateFactory {
    static getValidator(questType: QuestType): QuestValidator {
        switch (questType) {
            case "daily":
                return new DailyValidator()
            case "social":
                return new SocialValidator()
            default:
                throw new Error("Unsupported quest type: " + questType)
        }
    }
}