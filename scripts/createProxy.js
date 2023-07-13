const { writeToEnvFile } = require("./utils/helper");
require("dotenv").config();

async function main() {
  const acc = (await hre.ethers.getSigners())[1];
  const nullAddress = "0x0000000000000000000000000000000000000000";

  const proxyRegistry = await hre.ethers.getContractAt(
    "IProxyRegistry",
    process.env.DS_PROXY_REGISTRY_ADDRESS
  );
  let proxyAddr = await proxyRegistry.proxies(acc.address);
  // Nếu k tồn tại thì thực hiện tạo mới luôn
  if (proxyAddr === nullAddress) {
    const rest = await proxyRegistry.build(acc.address);
    await rest.wait();
    proxyAddr = await proxyRegistry.proxies(acc.address);
    console.log("ProxyAddr:: 1", proxyAddr);
  }
  console.log("ProxyAddr::", proxyAddr);
  writeToEnvFile("DS_PROXY", proxyAddr);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
