#include <Arduino.h>
#include <Wire.h>

// LILYGO T-SIM7080G-S3 pins
constexpr int I2C_SDA_PIN = 15;
constexpr int I2C_SCL_PIN = 7;
constexpr int MODEM_PWR_PIN = 41;
constexpr int MODEM_RX_PIN = 4;
constexpr int MODEM_TX_PIN = 5;

// AXP2101 PMU registers
constexpr uint8_t PMU_ADDR = 0x34;
constexpr uint8_t REG_CHIP_ID = 0x03;
constexpr uint8_t REG_ADC_CTRL = 0x30;
constexpr uint8_t REG_DC_ONOFF = 0x80;
constexpr uint8_t REG_DC3_VOLTAGE = 0x84;
constexpr uint8_t REG_LDO_ONOFF = 0x90;
constexpr uint8_t REG_BLDO2_VOLTAGE = 0x97;

bool readRegister(uint8_t reg, uint8_t &value) {
  Wire.beginTransmission(PMU_ADDR);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return false;
  if (Wire.requestFrom(PMU_ADDR, (uint8_t)1) != 1) return false;
  value = Wire.read();
  return true;
}

bool writeRegister(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(PMU_ADDR);
  Wire.write(reg);
  Wire.write(value);
  return Wire.endTransmission() == 0;
}

bool updateRegister(uint8_t reg, uint8_t clearMask, uint8_t setMask) {
  uint8_t value = 0;
  if (!readRegister(reg, value)) return false;
  return writeRegister(reg, (value & ~clearMask) | setMask);
}

bool enableModemPower() {
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);

  uint8_t chipId = 0;
  if (!readRegister(REG_CHIP_ID, chipId) || chipId != 0x4A) return false;

  // Disable DC3 before setting it to 3.0 V.
  if (!updateRegister(REG_DC_ONOFF, bit(2), 0)) return false;
  delay(200);

  uint8_t value = 0;
  if (!readRegister(REG_DC3_VOLTAGE, value)) return false;
  if (!writeRegister(REG_DC3_VOLTAGE, (value & 0x80) | 0x66)) return false;
  if (!updateRegister(REG_DC_ONOFF, 0, bit(2))) return false;

  // Enable BLDO2 at 3.3 V for the GNSS antenna.
  if (!readRegister(REG_BLDO2_VOLTAGE, value)) return false;
  if (!writeRegister(REG_BLDO2_VOLTAGE, (value & 0xE0) | 0x1C)) return false;
  if (!updateRegister(REG_LDO_ONOFF, 0, bit(5))) return false;

  // Disable TS measurement because the board has no NTC sensor.
  return updateRegister(REG_ADC_CTRL, bit(1), 0);
}

void pressModemPowerKey() {
  pinMode(MODEM_PWR_PIN, OUTPUT);
  digitalWrite(MODEM_PWR_PIN, LOW);
  delay(100);
  digitalWrite(MODEM_PWR_PIN, HIGH);
  delay(1100);
  digitalWrite(MODEM_PWR_PIN, LOW);
}

void sendCommand(const char *command) {
  Serial.print("Sending: ");
  Serial.println(command);
  Serial1.println(command);
  delay(1000);

  while (Serial1.available()) {
    Serial.write(Serial1.read());
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Restoring SIM7080G modem lights...");

  if (!enableModemPower()) {
    Serial.println("ERROR: Cannot configure AXP2101 PMU");
    return;
  }

  Serial1.begin(115200, SERIAL_8N1, MODEM_RX_PIN, MODEM_TX_PIN);
  pressModemPowerKey();

  // Give the modem time to boot and light its STATUS LED.
  delay(8000);
  sendCommand("AT");
  sendCommand("AT+CNETLIGHT=1");

  Serial.println("Modem power is ON.");
  Serial.println("STATUS should stay on; NETLIGHT should blink.");
}

void loop() {
  while (Serial1.available()) {
    Serial.write(Serial1.read());
  }
  delay(10);
}
