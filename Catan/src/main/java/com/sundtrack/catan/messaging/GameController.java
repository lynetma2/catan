package com.sundtrack.catan.messaging;

import com.sundtrack.catan.game.Board;
import com.sundtrack.catan.game.MapBuilder;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting(new Board(MapBuilder.classicNotRandom()));
        //return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

    @MessageMapping("/event")
    @SendTo("/game/status")
    public Board joining(HelloMessage message) {
        System.out.println("Person joined");
        return new Board(MapBuilder.classicNotRandom());
    }

}