export enum ResourceType {
    Wood = "Wood",
    Brick = "Brick",
    Sheep = "Sheep",
    Wheat = "Wheat",
    Ore = "Ore"
}

export enum EdgeDirection {
    North = "North",
    East = "East",
    West = "West"
}

export enum VertexDirection {
    East = "East",
    West = "West"
}

export enum BuildingType {
    Settlement = "Settlement",
    City = "City"
}

export enum TileKind {
    ResourceTile = "ResourceTile",
    SeaTile = "SeaTile",
    PortTile = "PortTile",
    DessertTile = "DessertTile"
}

export enum GamePhase {
    Setup = "Setup",
    Default = "Default",
}

export enum MoveType {
    placeSettlement = "PlaceSettlement",
    placeCity = "PlaceCity",
    placeRoad = "PlaceRoad"
}

export enum ButtonType {
    drawDevelopmentCard = "DrawDevelopmentCard",
    putSettlement = "PutSettlement",
    putCity = "PutCity",
    putRoad = "PutRoad",
    endTurn = "EndTurn",
    waiting = "Waiting",
}

export enum Anchor {
    TopLeft,
    TopCenter,
    TopRight,
    MiddleLeft,
    Center,
    MiddleRight,
    BottomLeft,
    BottomCenter,
    BottomRight
}

export enum EventType {
    BuildRoad = "BuildRoad",
    BuildSettlement = "BuildSettlement",
    BuildCity = "BuildCity",
    BuyDevelopmentCard = "BuyDevelopmentCard",
    EndTurn = "EndTurn",
    RollDice = "RollDice",
    TransferResources = "TransferResources"
}