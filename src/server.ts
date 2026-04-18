import app from "./app";
import { envConfig } from "./app/config/env";
import { prisma } from "./app/lib/prisma";
import { seedAdmin } from "./app/scripts/seedAdmin";

const main = async () => {
  try {
    await prisma.$connect();
    await seedAdmin();
    app.listen(envConfig.PORT, () => {
      console.log(`Server is running on port ${envConfig.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
