import express from "express";
import passport from "passport";
import {
  getlogin,
  postlogin,
  logout,
  getjoin,
  postjoin,
  githubLogin,
  postGithubLogin,
  getMe,
  facebookLogin,
  postFacebookLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { onlyPrivate, onlyPublic } from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.join, onlyPublic, getjoin);
globalRouter.post(routes.join, onlyPublic, postjoin, postjoin);

globalRouter.get(routes.login, onlyPublic, getlogin);
globalRouter.post(routes.login, onlyPublic, postlogin);

globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.search, search);

globalRouter.get(routes.github, githubLogin);

globalRouter.get(
  routes.githubcallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.facebook, facebookLogin);

globalRouter.get(
  routes.facebookcallback,
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  postFacebookLogin
);
export default globalRouter;
