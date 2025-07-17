package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.cards.DevelopmentCard;

public class UseDevelopmentCard extends GameEvent{

    private DevelopmentCard developmentCard;

    public UseDevelopmentCard(String player, int id, DevelopmentCard developmentCard)
    {
        super(EventKind.USEDEVELOPMENTCARD, player, id);
        this.developmentCard = developmentCard;
    }

    @Override
    public void doEvent(Game game) {
        //TODO add this but maybe after testing the other stuff.
    }

    //TODO add methods to handle the event happening.


}
