import { Interaction } from "discord.js";
import interactionHandler from "../handlers/interactions/";

export function run(interaction: Interaction<"cached">) {
    interactionHandler(interaction);
};