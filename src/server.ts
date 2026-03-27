import app from "./app";
import { envConfig } from "./app/config/env";

const main = async () => {
  try {
    app.listen(envConfig.PORT, () => {
      console.log(`Server is running on port ${envConfig.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
