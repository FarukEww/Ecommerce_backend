import express, { NextFunction, Request, Response } from "express";
import connectDB from "./src/config/db";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import categoryRouter from "./src/routes/admin/categoryRoutes";
import colorRouter from "./src/routes/admin/colorRoutes";
import productRoute from "./src/routes/web/productRoutes";
import imageRoute from "./src/routes/admin/imageRoutes";
import mainRouter from "./src/routes/mainRotes";

const app = express();
dotenv.config();
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    callback(null, true);
  },
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static("app/public"));
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.bodyParser())
const port = process.env.PORT;
connectDB();
interface RequestWithGuestId extends Request {
  guestId?: string;
}
// app.use((req: RequestWithGuestId, res: Response, next: NextFunction) => {
//   if (!req.cookies.guestId) {
//     const guestId = uuidv4();
//     res.cookie("guestId", guestId, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       secure: false,
//       sameSite: "Lax",
//     }); // 30 days
//     req.guestId = guestId;
//   } else {
//     req.guestId = req.cookies.guestId;
//   }
//   next();
// });

app.get("/", (req: RequestWithGuestId, res: Response) => {
  res.json({ status: true, sid: req.guestId });
});

app.use("", mainRouter);
// app.use('/api',)
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
