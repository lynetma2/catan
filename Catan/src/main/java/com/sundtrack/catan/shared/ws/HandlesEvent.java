package com.sundtrack.catan.shared.ws;

import com.sundtrack.catan.shared.event.ClientAction;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface HandlesEvent {

    Class<? extends ClientAction> value();
}
