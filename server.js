import app from "./app.js";

app.listen(process.env.PORT, () => {
  console.log(`App listning on port ${process.env.PORT}`);
});
