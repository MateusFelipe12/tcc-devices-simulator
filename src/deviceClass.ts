import 'dotenv/config';

export enum DeviceType {
  TEMPERATURE_SENSOR = 'temperature_sensor',
  HUMIDITY_SENSOR = 'humidity_sensor',
  PRESSURE_SENSOR = 'pressure_sensor',
  MOTOR = 'motor',
}

export interface CustomMetrics {
  humidity?: number;
  pressure?: number;
  rpm?: number;
  vibration?: number;
}

export class Device {
  public serialNumber: string;
  public deviceType: DeviceType;
  public name: string;
  public bootTime: Date;
  public lastHeartbeat: Date;

  private load: number;
  private memoryFree: number;
  private memoryTotal: number;
  private diskFree: number;
  private diskTotal: number;
  private upload: number;
  private download: number;
  private temperature: number;

  constructor(serialNumber: string, deviceType: DeviceType, memoryTotal: number, diskTotal: number) {
    this.serialNumber = serialNumber;
    this.deviceType = deviceType;
    this.name = `${deviceType}_${serialNumber}`;
    this.bootTime = new Date();
    this.lastHeartbeat = new Date();

    this.load = Number((Math.random() * 2).toFixed(2)); // máximo de 2 pra iniciar
    this.memoryFree = memoryTotal - Math.floor(Math.random() * 100);
    this.memoryTotal = memoryTotal;
    this.diskFree = diskTotal - Math.floor(Math.random() * 100);
    this.diskTotal = diskTotal;
    this.upload = 0;
    this.download = 0;
    this.temperature = Math.floor(Math.random() * 50); // máximo de 50 pra iniciar
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
    const addOrSubtract = Math.random() > 0.5 ? 1 : -1;

    this.load += Number((addOrSubtract * Math.random() * 2).toFixed(2));
    this.memoryFree += addOrSubtract * Math.floor(Math.random() * 100);
    this.temperature += addOrSubtract * Math.floor(Math.random() * 50);
    this.diskFree = this.diskTotal - Number(Math.floor(Math.random() * 100).toFixed(2));
    this.upload += Math.floor(Math.random() * 100);
    this.download += Math.floor(Math.random() * 100);
    
    this.load = Number(Math.max((Math.random() * 2), this.load).toFixed(2));
    this.memoryFree = Number(Math.max((Math.random() * 100), this.memoryFree).toFixed(2));
    this.temperature = Number(Math.max(Number((Math.random() * 50).toFixed(2)), this.temperature).toFixed(2));
    
    
    return {
      serialNumber: this.serialNumber,
      load: this.load,
      memoryFree: this.memoryFree,
      memoryTotal: this.memoryTotal,
      diskFree: this.diskFree,
      diskTotal: this.diskTotal,
      upload: this.upload,
      download: this.download,
      temperature: this.temperature,
      customMetrics: this.generateCustomMetrics(),
      uptime: this.getLastUptime(),
    };
  }

  getLastUptime(): number {
    console.log(Math.floor((Date.now() - this.bootTime.getTime()) / 1000))
    return Math.floor((Date.now() - this.bootTime.getTime()) / 1000);
  }
}