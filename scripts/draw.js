function drawFigure(context, r){
    context.beginPath();
    context.moveTo(300, 300);
    context.lineTo(300, 300 + 40 * r);
    context.lineTo(300 - 20 * r, 300 + 40 * r);
    context.lineTo(300 - 20 * r, 300);
    context.lineTo(300, 300);
    context.fill();

    context.beginPath();
    context.lineTo(300, 300 + 20 * r);
    context.lineTo(300 + 20 * r, 300);
    context.lineTo(300, 300);
    context.fill();

    context.beginPath();
    context.arc(300, 300, 20 * r, 1.5 * Math.PI, 2 * Math.PI, false);
    context.fill();

    context.beginPath();
    context.moveTo(300, 300);
    context.lineTo(300 + 20 * r, 300);
    context.lineTo(300, 300 - 20 * r);
    context.moveTo(300, 300);
    context.fill();
}

function drawPoint(context, x, y){
    context.beginPath();
    context.fillStyle = "red";
    context.moveTo(x, y);
    context.arc(x, y, 3, 0, Math.PI * 2, false);
    context.fill();
}

function drawCoords(canvas, context) {
    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2;
    const centerY = height / 2;

    context.beginPath();
    context.moveTo(0, centerY);
    context.lineTo(width, centerY);
    context.moveTo(width - 10, centerY - 10);
    context.lineTo(width, centerY)
    context.moveTo(width - 10, centerY + 10);
    context.lineTo(width, centerY);
    context.stroke();

    context.beginPath();
    context.moveTo(centerX, height);
    context.lineTo(centerX, 0);
    context.moveTo(centerX - 10, 10);
    context.lineTo(centerX, 0);
    context.moveTo(centerX + 10, 10);
    context.lineTo(centerX, 0);
    context.stroke();
    context.strokeStyle = "black";
    for (let i = -12; i <= 12; i++) {
        if (i === 0) continue;
        const x = 300 + i * 20;
        const y = 300 + i * 20;
        const isInteger = i % 2 === 0;
        const tickSize = isInteger ? 12 : 6;
        context.beginPath();
        context.moveTo(x, 300 - tickSize / 2);
        context.lineTo(x, 300 + tickSize / 2);
        context.stroke();
        context.beginPath();
        context.moveTo(300 - tickSize / 2, y);
        context.lineTo(300 + tickSize / 2, y);
        context.stroke();
    }
    context.font = "14px Arial";
    context.fillStyle = "black";
    for (let i = 1; i <= 6; i++) {
        const offset = i * 40;
        context.fillText(i, 300 + offset - 4, 320);
        context.fillText(-i, 300 - offset - 8, 320);
        context.fillText(i, 280, 300 - offset + 4);
        context.fillText(-i, 274, 300 + offset + 4);
    }
}
