import {DevelopmentCardType} from "@/game/model/enums.ts";
import type {GameState} from "@/game/model/types.ts";

export class DeckService {
    
    public static createDeck(): DevelopmentCardType[] {
        const deck: DevelopmentCardType[] = [];
        
        // Standard Catan Deck Composition (25 cards)
        // 14 Knights
        for (let i = 0; i < 14; i++) deck.push(DevelopmentCardType.Knight);
        
        // 5 Victory Points
        for (let i = 0; i < 5; i++) deck.push(DevelopmentCardType.VictoryPoint);
        
        // 2 Road Building
        for (let i = 0; i < 2; i++) deck.push(DevelopmentCardType.RoadBuilding);
        
        // 2 Year of Plenty
        for (let i = 0; i < 2; i++) deck.push(DevelopmentCardType.YearOfPlenty);
        
        // 2 Monopoly
        for (let i = 0; i < 2; i++) deck.push(DevelopmentCardType.Monopoly);
        
        return this.shuffle(deck);
    }

    public static draw(game: GameState): DevelopmentCardType | null {
        if (game.deck.length === 0) return null;
        return game.deck.pop() || null;
    }

    private static shuffle(deck: DevelopmentCardType[]): DevelopmentCardType[] {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
}