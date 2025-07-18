import {
    BrickSVGString, DevelopmentCardBackSVGString,
    Dice1SVGString,
    Dice2SVGString,
    Dice3SVGString,
    Dice4SVGString,
    Dice5SVGString,
    Dice6SVGString, SheepSVGString, StoneSVGString, WheatSVGString, WoodSVGString
} from "@/assets/assets.tsx";

export const drawBankCards = (canvas: HTMLCanvasElement, resources: number[], developmentCards: number, x: number, y: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Can\'t draw bank resources');
        return;
    }
    const bankHeight = 80;
    const bankWidth = 200;

    //Draw the box with the bank
    ctx.beginPath();
    ctx.fillStyle = "#faf3e1";
    ctx.fillRect(x, y, bankWidth, bankHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, bankWidth, bankHeight);
    ctx.closePath();

    //Draw the actual cards
    const cardHeight = 35;
    const cardWidth = 25;
    const iconHeight = 15;
    const iconWidth = 15;
    const margin = 5;
    let currentX = x + 2 * margin;
    const currentY = y + 2 * margin;
    resources.forEach((resource, kind) => {
        const image = new Image();
        switch (kind) {
            case 0: //Lumber
                ctx.fillStyle = "darkgreen";
                image.src = WoodSVGString(iconWidth,iconHeight,"brown")
                break;
            case 1: //Brick
                ctx.fillStyle = "brown";
                image.src = BrickSVGString(iconWidth,iconHeight,"orange")
                break;
            case 2: //Grain
                ctx.fillStyle = "green";
                image.src = WheatSVGString(iconWidth,iconHeight,"yellow")
                break;
            case 3: //Wool
                ctx.fillStyle = "lightGreen";
                image.src = SheepSVGString(iconWidth,iconHeight, "black")
                break;
            case 4: //Ore
                ctx.fillStyle = "Gray";
                image.src = StoneSVGString(iconWidth,iconHeight, "darkGray")
                break;
        }

        ctx.beginPath();
        ctx.fillRect(currentX, currentY, cardWidth, cardHeight);
        ctx.closePath();
        ctx.drawImage(image, currentX + 5, currentY + 5);

        //Number
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillText(resource.toString(), currentX + 8, currentY + 45);
        ctx.closePath();

        currentX = currentX + cardWidth + margin;
    });

    //Draw the development cards in the bank
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(currentX, currentY, cardWidth, cardHeight);
    ctx.strokeStyle = "purple";
    ctx.strokeRect(currentX, currentY, cardWidth, cardHeight);
    ctx.closePath();

    const image = new Image();
    image.src = DevelopmentCardBackSVGString(iconWidth,iconHeight,"black");
    ctx.drawImage(image, currentX + 5, currentY + 5);

    //Number of
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillText(developmentCards.toString(), currentX + 8, currentY + 45);
    ctx.closePath();

}

export const drawDices = (canvas: HTMLCanvasElement, dices: number[], x: number, y: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Can\'t draw dices');
        return;
    }

    const diceWidth = 50;
    const diceHeight = 50;
    const diceMargin = 5;

    let currentX = x;

    dices.forEach((dice) => {
        const image = new Image();
        switch (dice) {
            case 1:
                image.src = Dice1SVGString(diceWidth, diceHeight, "black");
                break;
            case 2:
                image.src = Dice2SVGString(diceWidth, diceHeight, "black");
                break;
            case 3:
                image.src = Dice3SVGString(diceWidth, diceHeight, "black");
                break;
            case 4:
                image.src = Dice4SVGString(diceWidth, diceHeight, "black");
                break;
            case 5:
                image.src = Dice5SVGString(diceWidth, diceHeight, "black");
                break;
            case 6:
                image.src = Dice6SVGString(diceWidth, diceHeight, "black");
                break;
        }

        ctx.drawImage(image, currentX, y);

        currentX = currentX + diceWidth + diceMargin;
    })

}