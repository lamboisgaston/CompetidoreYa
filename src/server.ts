import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`CompetidoreYa API escuchando en puerto ${env.PORT}`);
});
