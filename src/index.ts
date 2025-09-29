import 'dotenv/config';

enum DeviceType {
  TEMPERATURE_SENSOR = 'temperature_sensor',
  HUMIDITY_SENSOR = 'humidity_sensor',
  PRESSURE_SENSOR = 'pressure_sensor',
  MOTOR = 'motor',
}

interface CustomMetrics {
  humidity?: number;
  pressure?: number;
  rpm?: number;
  vibration?: number;
}

class Device {
  public serialNumber: string;
  public deviceType: DeviceType;
  public name: string;
  public bootTime: Date;
  public lastHeartbeat: Date;

  constructor(serialNumber: string, deviceType: DeviceType) {
    this.serialNumber = serialNumber;
    this.deviceType = deviceType;
    this.name = `${deviceType}_${serialNumber}`;
    this.bootTime = new Date();
    this.lastHeartbeat = new Date();
  }

  generateCustomMetrics(): CustomMetrics {
    const metrics: CustomMetrics = {};

    switch (this.deviceType) {
      case DeviceType.TEMPERATURE_SENSOR:
        metrics.humidity = Math.floor(Math.random() * 100);
        metrics.pressure = Math.floor(Math.random() * 1000) + 900;
        break;
      
      case DeviceType.MOTOR:
        metrics.rpm = Math.floor(Math.random() * 3000) + 1000;
        metrics.vibration = Math.floor(Math.random() * 10);
        break;
      
      case DeviceType.HUMIDITY_SENSOR:
        metrics.humidity = Math.floor(Math.random() * 100);
        break;
      
      case DeviceType.PRESSURE_SENSOR:
        metrics.pressure = Math.floor(Math.random() * 1000) + 900;
        break;
    }

    return metrics;
  }

  getCurrentUptime(): number {
    return Math.floor((new Date().getTime() - this.bootTime.getTime()) / 1000);
  }

  generateInformation() {
    this.lastHeartbeat = new Date();
    
    return {
      serialNumber: this.serialNumber,
      load: Math.floor(Math.random() * 100),
      memoryFree: Math.floor(Math.random() * 100),
      memoryTotal: Math.floor(Math.random() * 100),
      diskFree: Math.floor(Math.random() * 100),
      diskUsed: Math.floor(Math.random() * 100),
      upload: Math.floor(Math.random() * 100),
      download: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 50) + 30,
      customMetrics: this.generateCustomMetrics()
    };
  }
}

async function main() {
  const devicesQuantity = process.env.DEVICES_QUANTITY;
  const baseUrl = process.env.BASE_URL;
  const devicesPeriodicIntervalInformations = process.env.DEVICES_PERIODIC_INTERVAL_INFORM;
  
  if (!baseUrl) throw new Error('BASE_URL is not set');
  if (!devicesQuantity) throw new Error('DEVICES_QUANTITY is not set');
  if (!devicesPeriodicIntervalInformations) throw new Error('DEVICES_PERIODIC_INTERVAL_INFORM is not set');
  
  console.log(`Iniciando simulação de ${devicesQuantity} dispositivos com intervalo de ${devicesPeriodicIntervalInformations} segundos`);
  
  const devices: Device[] = [];
  
  const deviceTypes = Object.values(DeviceType);
  
  for (let i = 0; i < Number(devicesQuantity); i++) {
    const deviceType = deviceTypes[i % deviceTypes.length];
    const device = new Device(i.toString(), deviceType); // todo: recuperar estado do dispositivo
    devices.push(device);
    
    console.log(`Dispositivo ${i} criado: ${device.name} (${deviceType})`);
    
    sendInformation(device);
    
    setInterval(async () => {
      try {
        await sendInformation(device);
      } catch (error) {
        console.error(`Erro ao fazer requisição para dispositivo ${device.serialNumber}:`, error);
      }
    }, Number(devicesPeriodicIntervalInformations) * 1000);
  }
  
  console.log(`Simulação iniciada com ${devices.length} dispositivos`);
}

async function sendInformation(device: Device) {
  const deviceInfo = device.generateInformation();
  console.log(deviceInfo);
  
  const agentUrl = process.env.BASE_URL;
  
  // const response = await fetch(`${agentUrl}/informations`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(deviceInfo)
  // });

  // if (response.ok) {
  //   const data = await response.json();
  //   console.log(`✓ Dispositivo ${device.serialNumber} (${device.deviceType}) - Uptime: ${device.getCurrentUptime()}s - Métricas: ${Object.keys(deviceInfo.customMetrics || {}).join(', ') || 'nenhuma'}`);
  // } else {
  //   console.error(`✗ Erro na requisição do dispositivo ${device.serialNumber}:`, response.status, response.statusText);
  // }
}

main();