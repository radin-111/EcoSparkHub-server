import app from "./app";
import { envConfig } from "./app/config/env";
import { prisma } from "./app/lib/prisma";

const main = async () => {
  try {
    await prisma.$connect();
    app.listen(envConfig.PORT, () => {
      console.log(`Server is running on port ${envConfig.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
