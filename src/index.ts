import 'dotenv/config';

async function main() {
  const devicesQuantity = process.env.DEVICES_QUANTITY;
  const baseUrl = process.env.BASE_URL;
  const devicesPeriodicIntervalInformations = process.env.DEVICES_PERIODIC_INTERVAL_INFORM;
  if (!baseUrl) throw new Error('BASE_URL is not set');
  if (!devicesQuantity) throw new Error('DEVICES_QUANTITY is not set');
  if (!devicesPeriodicIntervalInformations) throw new Error('DEVICES_PERIODIC_INTERVAL_INFORM is not set');
  console.log(`Iniciando simulação de ${devicesQuantity} dispositivos com intervalo de ${devicesPeriodicIntervalInformations} segundos`);
  for (let i = 0; i < Number(devicesQuantity); i++) {
    setInterval(async () => {
      try {
        const response = await fetch(`${baseUrl}/informations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serialNumber: `DEVICE${i}`,
            load: Math.floor(Math.random() * 100),
            memoryFree: Math.floor(Math.random() * 100),
            memoryTotal: Math.floor(Math.random() * 100),
            diskFree: Math.floor(Math.random() * 100),
            diskUsed: Math.floor(Math.random() * 100),
            upload: Math.floor(Math.random() * 100),
            download: Math.floor(Math.random() * 100),
            temperature: Math.floor(Math.random() * 50) + 30,
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dados enviados com sucesso:', data);
        } else {
          console.error('Erro na requisição:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Erro ao fazer requisição:', error);
      }
    }, Number(devicesPeriodicIntervalInformations) * 1000);
    await new Promise(resolve => setTimeout(resolve, 500 ));
  }
}
main();
