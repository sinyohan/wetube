import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import mongostore from "connect-mongo";
import passport from "passport";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import { localsMiddleware } from "./middlewares";
import "./passport";

dotenv.config();

const app = express();

const CokieStore = mongostore(session);
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(localsMiddleware);
//  initialize , session을 써야지 로그인 인증 구현이 된다고
// 일단은 암기한다
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(routes.home, globalRouter);
app.use(routes.videos, videoRouter);
app.use(routes.users, userRouter);
export default app;
