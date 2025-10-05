import fs from 'fs';
import 'dotenv/config';
import { Device, DeviceType } from './deviceClass';

async function main() {
  const devicesQuantity = Number(process.env.DEVICES_QUANTITY);
  const baseUrl = process.env.BASE_URL;
  const devicesPeriodicIntervalInformations = Number(process.env.DEVICES_PERIODIC_INTERVAL_INFORM);
  
  if (!baseUrl) throw new Error('BASE_URL is not set');
  if (!devicesQuantity) throw new Error('DEVICES_QUANTITY is not set');
  if (!devicesPeriodicIntervalInformations) throw new Error('DEVICES_PERIODIC_INTERVAL_INFORM is not set');
  
  
  const devices: Device[] = [];
  let devicesFromFile: {serialNumber: string, deviceType: DeviceType, memoryTotal: number, diskTotal: number}[] = [];

  if (fs.existsSync('devices.json')) {
    devicesFromFile = Object.values(JSON.parse(fs.readFileSync('devices.json', 'utf8')))
    devicesFromFile.forEach((device, index: number) => {
      if ((index) >= devicesQuantity) return;
      devices.push(new Device(device.serialNumber, device.deviceType, device.memoryTotal, device.diskTotal));
    });
  }
  
  const deviceTypes = Object.values(DeviceType);
  
  for (let i = devices.length; i < devicesQuantity; i++) {
    const deviceType = deviceTypes[i % deviceTypes.length];
    const memoryTotal = Math.floor(Math.random() * 1000) + 1000;
    const diskTotal = Math.floor(Math.random() * 1000) + 1000;
    const device = new Device(i.toString(), deviceType, memoryTotal, diskTotal); // todo: recuperar estado do dispositivo
    console.log(`Dispositivo ${i} criado: ${device.name} (${deviceType})`);
    devices.push(device);
    devicesFromFile.push({serialNumber: generateRandomString(10), deviceType, memoryTotal, diskTotal});
  }
  
  fs.writeFileSync('devices.json', JSON.stringify(devicesFromFile || {}, null, 2));

  for (const device of devices) {
    try {
      await sendInformation(device);
    } catch (error) {
      console.error(`Erro ao fazer primeira requisição para dispositivo ${device.serialNumber}:`, error);
    }
    
    setInterval(async () => {
      try {
        await sendInformation(device);
      } catch (error) {
        console.error(`Erro ao fazer requisição para dispositivo ${device.serialNumber}:`, error);
      }
    }, devicesPeriodicIntervalInformations * 1000);
  }
  console.log(`Simulando ${devicesQuantity} dispositivos com intervalo de ${devicesPeriodicIntervalInformations} segundos iniciada`);

}

async function sendInformation(device: Device) {
  const deviceInfo = device.generateInformation();
  
  const agentUrl = process.env.BASE_URL;
  
  const response = await fetch(`${agentUrl}/informations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deviceInfo)
  });

  if (!response.ok) {
    console.error(`✗ Erro na requisição do dispositivo ${device.serialNumber}:`, response.status, response.statusText);
  }
}

main();

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
