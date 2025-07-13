package com.sundtrack.catan.messaging;

import com.sundtrack.catan.game.entity.Board;

public class Greeting {

    private Board content;

    public Greeting() {
    }

    public Greeting(Board content) {
        this.content = content;
    }

    public Board getContent() {
        return content;
    }

}
