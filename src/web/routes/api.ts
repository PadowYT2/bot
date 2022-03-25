import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import config from "../../../config";
import discordoauth2 from "discord-oauth2";
import { manager } from "../../sharding";
import { ModifiedClient, SessionUser, CustomGuild } from "../../constants/types";
import { Permissions } from "discord.js";
const oauth2 = new discordoauth2({
    clientId: config.client.id,
    clientSecret: config.client.secret,
    redirectUri: config.redirectUri
});

export = (fastify: FastifyInstance, _: any, done: HookHandlerDoneFunction) => {
    fastify.get("/shards", async (_, res) => {
        const newBotInfo = await manager.broadcastEval((bot) => ({
            status: bot.ws.status,
            guilds: bot.guilds.cache.size,
            cachedUsers: bot.users.cache.size,
            users: bot.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0),
            ping: bot.ws.ping,
            loading: (bot as ModifiedClient).loading
        })).then((results) => results.reduce((info, next, index) => {
            for (const [key, value] of Object.entries(next)) {
                if (["guilds", "cachedUsers", "users"].includes(key)) info[key] = (info[key] || 0) + value;
            };
            info.shards[index] = next;
            return info;
        }, { shards: {}, lastUpdate: 0 }));
        newBotInfo.lastUpdate = Date.now();
        res.send(newBotInfo);
    });
    fastify.get("/login", (_, res): any => res.redirect(
        oauth2.generateAuthUrl({
            scope: ["identify", "guilds"],
            responseType: "code",
        })
    ));
    fastify.get("/logout", (req: any, res) => {
        req.session.user = null;
        res.redirect(req.session.lastPage);
    });
    fastify.get("/authorize", async (req: any, res) => {
        const a = await oauth2.tokenRequest({
            code: req.query.code,
            scope: ["identify", "guilds"],
            grantType: "authorization_code"
        }).catch(() => res.redirect(req.session.lastPage));

        if (!a.access_token) return res.redirect("/api/login");

        const user = await oauth2.getUser(a.access_token);
        req.session.user = user;
        req.session.user.guilds = await oauth2.getUserGuilds(a.access_token);
        res.redirect(req.session.lastPage);
    });

    fastify.get("/user/guilds", async (req: any, res) => {
        const user = req.session.user as SessionUser | null;
        if (!user) return res.redirect("/api/login");

        const guilds: CustomGuild[] = [];

        await Promise.all(user.guilds.map(async (rawguild) => {
            guilds.push({
                id: rawguild.id,
                name: rawguild.name,
                iconUrl: rawguild.icon ? `https://cdn.discordapp.com/icons/${rawguild.id}/${rawguild.icon}.png` : null,
                managed: new Permissions().add(rawguild.permissions_new as any).has("ADMINISTRATOR")
            });
        }));

        res.send(guilds);
    });
    done();
};