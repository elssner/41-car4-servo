radio.onReceivedNumber(function (receivedNumber) {
    btLaufzeit = input.runningTime()
    if (bit.between(receivedNumber, 45, 135)) {
        bit.comment("Servo")
        ServoSteuerung(receivedNumber)
    }
})
function ServoSteuerung (pWinkel: number) {
    if (!(btConnected)) {
        bit.comment("Bluetooth unterbrochen")
        iWinkel = 90
    } else if (iWinkel != pWinkel) {
        bit.comment("connected und Wert geändert")
        iWinkel = pWinkel
        pins.servoWritePin(AnalogPin.C17, iWinkel)
    }
    return iWinkel
}
let iWinkel = 0
let btLaufzeit = 0
let btConnected = false
btConnected = true
btLaufzeit = input.runningTime()
loops.everyInterval(500, function () {
    bit.comment("Überwachung Bluetooth")
    if (input.runningTime() - btLaufzeit < 0) {
        if (!(btConnected)) {
            btConnected = true
            basic.setLedColor(0x00ff00)
        }
    } else {
        btConnected = false
        if (Math.trunc(input.runningTime() / 1000) % 2 == 1) {
            basic.setLedColor(0x0000ff)
        } else {
            basic.turnRgbLedOff()
        }
    }
})
