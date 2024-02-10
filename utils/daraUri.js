import DataUrilParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  const parser = new DataUrilParser();
  const extname = path.extname(file.originalname).toString();

  return parser.format(extname, file.buffer);
};

export default getDataUri;
