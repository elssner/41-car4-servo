radio.onReceivedNumber(function (receivedNumber) {
    btLaufzeit = input.runningTime()
    if (bit.between(receivedNumber, 30, 150)) {
        bit.comment("Servo")
        ServoSteuerung(receivedNumber)
    }
})
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    pins.digitalWritePin(DigitalPin.P0, 1)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    pins.digitalWritePin(DigitalPin.P0, 0)
})
function ServoSteuerung (pWinkel: number) {
    if (!(btConnected)) {
        bit.comment("Bluetooth unterbrochen")
        iWinkel = 90
    } else if (iWinkel != pWinkel) {
        bit.comment("connected und Wert geändert")
        iWinkel = pWinkel
        pins.servoWritePin(AnalogPin.C17, iWinkel + 6)
    }
    return iWinkel
}
let iWinkel = 0
let btLaufzeit = 0
let btConnected = false
radio.setGroup(240)
btConnected = true
btLaufzeit = input.runningTime()
pins.digitalWritePin(DigitalPin.P0, 1)
ServoSteuerung(90)
loops.everyInterval(500, function () {
    bit.comment("Überwachung Bluetooth")
    if (input.runningTime() - btLaufzeit < 1000) {
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
