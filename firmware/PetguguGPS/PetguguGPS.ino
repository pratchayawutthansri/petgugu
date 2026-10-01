#include <Arduino.h>

#include <Wire.h>

#define TINY_GSM_MODEM_SIM7080
#define TINY_GSM_RX_BUFFER 1024
#include <TinyGsmClient.h>

// LILYGO T-SIM7080G-S3 pin configuration
static constexpr int I2C_SDA_PIN = 15;
static constexpr int I2C_SCL_PIN = 7;
static constexpr int MODEM_PWR_PIN = 41;
static constexpr int MODEM_RX_PIN = 4;
static constexpr int MODEM_TX_PIN = 5;

TinyGsm modem(Serial1);

static constexpr uint8_t PMU_ADDRESS = 0x34;
static constexpr uint8_t PMU_CHIP_ID_REG = 0x03;
static constexpr uint8_t PMU_EXPECTED_CHIP_ID = 0x4A;
static constexpr uint8_t PMU_ADC_CHANNEL_CTRL = 0x30;
static constexpr uint8_t PMU_DC_ONOFF_CTRL = 0x80;
static constexpr uint8_t PMU_DC3_VOLTAGE_CTRL = 0x84;
static constexpr uint8_t PMU_LDO_ONOFF_CTRL = 0x90;
static constexpr uint8_t PMU_BLDO2_VOLTAGE_CTRL = 0x97;

float latitude = 0;
float longitude = 0;
float speedKnots = 0;
float altitudeMeters = 0;
float accuracyMeters = 0;
int satellitesVisible = 0;
int satellitesUsed = 0;
int gpsYear = 0;
int gpsMonth = 0;
int gpsDay = 0;
int gpsHour = 0;
int gpsMinute = 0;
int gpsSecond = 0;

bool readPmuRegister(uint8_t reg, uint8_t &value) {
  Wire.beginTransmission(PMU_ADDRESS);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return false;
  if (Wire.requestFrom(PMU_ADDRESS, (uint8_t)1) != 1) return false;
  value = Wire.read();
  return true;
}

bool writePmuRegister(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(PMU_ADDRESS);
  Wire.write(reg);
  Wire.write(value);
  return Wire.endTransmission() == 0;
}

bool updatePmuRegister(uint8_t reg, uint8_t clearMask, uint8_t setMask) {
  uint8_t value = 0;
  if (!readPmuRegister(reg, value)) return false;
  value = (value & ~clearMask) | setMask;
  return writePmuRegister(reg, value);
}

bool configurePmu() {
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);

  uint8_t chipId = 0;
  if (!readPmuRegister(PMU_CHIP_ID_REG, chipId)) return false;
  if (chipId != PMU_EXPECTED_CHIP_ID) {
    Serial.print("Unexpected PMU chip ID: 0x");
    Serial.println(chipId, HEX);
    return false;
  }

  // Disable DC3 before changing its voltage.
  if (!updatePmuRegister(PMU_DC_ONOFF_CTRL, bit(2), 0)) return false;
  delay(200);

  // DC3 = 3000 mV (AXP2101 register value 0x66).
  uint8_t dc3Voltage = 0;
  if (!readPmuRegister(PMU_DC3_VOLTAGE_CTRL, dc3Voltage)) return false;
  if (!writePmuRegister(PMU_DC3_VOLTAGE_CTRL,
                        (dc3Voltage & 0x80) | 0x66)) return false;
  if (!updatePmuRegister(PMU_DC_ONOFF_CTRL, 0, bit(2))) return false;

  // BLDO2 = 3300 mV (AXP2101 register value 0x1C).
  uint8_t bldo2Voltage = 0;
  if (!readPmuRegister(PMU_BLDO2_VOLTAGE_CTRL, bldo2Voltage)) return false;
  if (!writePmuRegister(PMU_BLDO2_VOLTAGE_CTRL,
                        (bldo2Voltage & 0xE0) | 0x1C)) return false;
  if (!updatePmuRegister(PMU_LDO_ONOFF_CTRL, 0, bit(5))) return false;

  // Disable TS-pin measurement because this board has no NTC sensor.
  return updatePmuRegister(PMU_ADC_CHANNEL_CTRL, bit(1), 0);
}

void pulseModemPowerKey() {
  digitalWrite(MODEM_PWR_PIN, LOW);
  delay(100);
  digitalWrite(MODEM_PWR_PIN, HIGH);
  delay(1000);
  digitalWrite(MODEM_PWR_PIN, LOW);
}

void setup() {
  Serial.begin(115200);

  // Do not wait forever when Serial Monitor is closed.
  const unsigned long serialWaitStarted = millis();
  while (!Serial && millis() - serialWaitStarted < 5000) {
    delay(10);
  }

  Serial.println();
  Serial.println("Petgugu GPS starting...");

  if (!configurePmu()) {
    Serial.println("ERROR: AXP2101 PMU not found");
    while (true) {
      delay(1000);
    }
  }

  Serial.println("PMU connected");

  Serial1.begin(115200, SERIAL_8N1, MODEM_RX_PIN, MODEM_TX_PIN);
  pinMode(MODEM_PWR_PIN, OUTPUT);
  pulseModemPowerKey();

  Serial.print("Starting SIM7080G");
  unsigned long modemStartedAt = millis();
  while (!modem.testAT(1000)) {
    Serial.print('.');

    if (millis() - modemStartedAt >= 15000) {
      Serial.println();
      Serial.println("Retrying modem power key...");
      pulseModemPowerKey();
      modemStartedAt = millis();
    }
  }

  Serial.println();
  Serial.println("SIM7080G ready");

  if (!modem.enableGPS()) {
    Serial.println("ERROR: Could not enable GNSS");
    while (true) {
      delay(1000);
    }
  }

  Serial.println("GNSS enabled");
  Serial.println("Place the antenna outdoors and wait for a fix...");
}

void loop() {
  if (modem.getGPS(
          &latitude,
          &longitude,
          &speedKnots,
          &altitudeMeters,
          &satellitesVisible,
          &satellitesUsed,
          &accuracyMeters,
          &gpsYear,
          &gpsMonth,
          &gpsDay,
          &gpsHour,
          &gpsMinute,
          &gpsSecond)) {
    Serial.println("GPS FIX");
    Serial.print("Latitude: ");
    Serial.println(latitude, 8);
    Serial.print("Longitude: ");
    Serial.println(longitude, 8);
    Serial.print("Altitude: ");
    Serial.print(altitudeMeters);
    Serial.println(" m");
    Serial.print("Speed: ");
    Serial.print(speedKnots);
    Serial.println(" knots");
    Serial.print("Satellites used/visible: ");
    Serial.print(satellitesUsed);
    Serial.print('/');
    Serial.println(satellitesVisible);
    Serial.print("Accuracy: ");
    Serial.print(accuracyMeters);
    Serial.println(" m");
    Serial.print("UTC: ");
    Serial.print(gpsYear);
    Serial.print('-');
    Serial.print(gpsMonth);
    Serial.print('-');
    Serial.print(gpsDay);
    Serial.print(' ');
    Serial.print(gpsHour);
    Serial.print(':');
    Serial.print(gpsMinute);
    Serial.print(':');
    Serial.println(gpsSecond);
    Serial.println();
  } else {
    Serial.println("Waiting for GPS fix...");
  }

  delay(5000);
}
