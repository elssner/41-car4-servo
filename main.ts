radio.onReceivedNumber(function (receivedNumber) {
    btLaufzeit = input.runningTime()
    qwiicmotor.setReceivedNumber(receivedNumber)
    bit.comment("0 Motor 0..128..255")
    MotorSteuerung(qwiicmotor.getReceivedNumber(NumberFormat.UInt8LE, qwiicmotor.eOffset.z0))
    bit.comment("1 Servo 0..128..255")
    ServoSteuerung(Math.round(Math.map(qwiicmotor.getReceivedNumber(NumberFormat.UInt8LE, qwiicmotor.eOffset.z1), 0, 255, 135, 45)))
})
function MotorSteuerung (pMotorPower: number) {
    if (!(btConnected)) {
        qwiicmotor.controlRegister(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D), qwiicmotor.eControl.DRIVER_ENABLE, false)
        iMotorPower = 128
        qwiicmotor.writeRegister(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D), qwiicmotor.qwiicmotor_eRegister(qwiicmotor.eRegister.MB_DRIVE), iMotorPower)
    } else if (iMotorPower != pMotorPower) {
        bit.comment("connected und nur wenn von Sender empfangener Wert geändert")
        iMotorPower = pMotorPower
        qwiicmotor.writeRegister(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D), qwiicmotor.qwiicmotor_eRegister(qwiicmotor.eRegister.MB_DRIVE), iMotorPower)
        qwiicmotor.controlRegister(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D), qwiicmotor.eControl.DRIVER_ENABLE, true)
    }
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    basic.showNumber(Math.round(Math.map(255, 0, 255, 135, 45)))
})
function zeigeStatus () {
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 0, 4, 7, Math.round(bit.measureInCentimeters(DigitalPin.C16)))
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 1, 0, 12, wattmeter.statuszeile(wattmeter.wattmeter_eADDR(wattmeter.eADDR.Watt_x45), wattmeter.eStatuszeile.v_mA))
}
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
let iMotorPower = 0
let btLaufzeit = 0
let btConnected = false
pins.digitalWritePin(DigitalPin.P0, 1)
lcd16x2rgb.initLCD(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E))
wattmeter.reset(wattmeter.wattmeter_eADDR(wattmeter.eADDR.Watt_x45))
zeigeStatus()
qwiicmotor.init(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D))
btConnected = true
btLaufzeit = input.runningTime()
radio.setGroup(240)
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
        zeigeStatus()
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 1, 13, 15, qwiicmotor.getStatus(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D), qwiicmotor.eStatus.ready))
    }
})
