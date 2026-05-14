
package com.sundtrack.catan.datalayer.domain.event.game.inbound;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DatabindContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.jsontype.impl.TypeIdResolverBase;

public class InboundGameEventTypeResolver extends TypeIdResolverBase {

    @Override
    public String idFromValue(Object value) {
        if (value instanceof InboundGameEvent event) {
            return event.type().name();
        }
        return null;
    }

    @Override
    public String idFromValueAndType(Object value, Class<?> suggestedType) {
        return idFromValue(value);
    }

    @Override
    public JavaType typeFromId(DatabindContext context, String id) {
        InboundGameEventType typeEnum = InboundGameEventType.valueOf(id);
        Class<?> clazz = typeEnum.eventClass;
        return context.constructType(clazz);
    }

    @Override
    public JsonTypeInfo.Id getMechanism() {
        return JsonTypeInfo.Id.CUSTOM;
    }
}