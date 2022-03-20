"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowWalkthrough = exports.formatExplanation = void 0;
const flow_1 = require("./flow");
const _1 = __importDefault(require("./"));
async function formatExplanation({ type, data }) {
    let { properties, explanation } = flow_1.flow.triggers[type] || flow_1.flow.actions[type];
    for (const i in properties)
        explanation = explanation.replace(`{${i}}`, await properties[i].format(data[i]));
    return explanation;
}
exports.formatExplanation = formatExplanation;
;
const allActionTypes = Object.keys(flow_1.flow.actions);
const allActions = Object.values(flow_1.flow.actions);
const allTriggerTypes = Object.keys(flow_1.flow.triggers);
const allTriggers = Object.values(flow_1.flow.triggers);
async function flowWalkthrough(guild, author, channel, newFlow, generateEmbed, pinned) {
    while (newFlow.triggers.length < _1.default.limitTriggers)
        newFlow.triggers.push(null);
    while (newFlow.actions.length < _1.default.limitActions)
        newFlow.actions.push(null);
    let editing = true, successStatus = false;
    while (editing) {
        try {
            await pinned.edit({ content: null, embeds: [await generateEmbed()] });
            const inputs = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 2 * 60 * 1000, errors: ["time"] });
            const input = inputs.first(), messagesToDelete = [input];
            const args = input.content?.split(" ");
            const command = args.shift().toLowerCase();
            if (command == "edit" && ["trigger", "action"].includes(args[0]) && parseInt(args[1])) {
                const slot = parseInt(args[1]);
                if (args[0] == "trigger") {
                    if (slot > _1.default.limitTriggers)
                        messagesToDelete.push(await channel.send(`❌ Вы можете иметь только ${_1.default.limitTriggers} триггера(-ов) на поток.`));
                    else {
                        messagesToDelete.push(await channel.send({
                            embeds: [{
                                    title: `📝 Выберите триггер на слот ${slot}`,
                                    description: "0 - **Очистить**\n\n" +
                                        allTriggers.map((trigger, index) => `${index + 1} - **${trigger.short}**${trigger.long ? `\n${trigger.long}` : ""}`).join("\n\n"),
                                    timestamp: Date.now()
                                }]
                        }));
                        const selections = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 1800000, errors: ["time"] });
                        const selection = selections.first(), newTriggerIndex = parseInt(selection.content);
                        messagesToDelete.push(selection);
                        if (newTriggerIndex == 0) {
                            newFlow.triggers[slot - 1] = null;
                            messagesToDelete.push(await channel.send({
                                embeds: [{
                                        title: `✅ Триггер ${slot} очищен!`,
                                        timestamp: Date.now()
                                    }]
                            }));
                        }
                        else if (!newTriggerIndex || newTriggerIndex > allTriggerTypes.length)
                            messagesToDelete.push(await channel.send("✴️ Неверный триггер. Отменено."));
                        else {
                            let trigger = allTriggers[newTriggerIndex - 1], newTrigger = {
                                type: allTriggerTypes[newTriggerIndex - 1],
                                data: []
                            };
                            for (const property of trigger.properties) {
                                messagesToDelete.push(await channel.send({
                                    embeds: [{
                                            title: `✏️ Укажите ${property.short}`,
                                            description: property.help || undefined,
                                            timestamp: Date.now()
                                        }]
                                }));
                                const values = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 1800000, errors: ["time"] });
                                const value = values.first(), convertedValue = await property.convert(value.content, { guild });
                                messagesToDelete.push(value);
                                if (convertedValue == null) {
                                    messagesToDelete.push(await channel.send({
                                        embeds: [{
                                                title: "❌ Неверное значение. Изменение триггера отменено.",
                                                timestamp: Date.now()
                                            }]
                                    }));
                                    break;
                                }
                                else
                                    newTrigger.data.push(convertedValue);
                            }
                            ;
                            if (newTrigger.data.length == trigger.properties.length) {
                                messagesToDelete.push(await channel.send({
                                    embeds: [{
                                            title: `💨 Подтвердите триггер ${slot}`,
                                            description: [
                                                "**Это правильно? Напишите `да` или `нет`.**",
                                                `${(await formatExplanation(newTrigger)).split("\n").map((l) => `> ${l}`).join("\n")}`
                                            ].join("\n"),
                                            timestamp: Date.now()
                                        }]
                                }));
                                const confirmations = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 1800000, errors: ["time"] });
                                const confirmation = confirmations.first(), confirmed = confirmation.content.toLowerCase() == "да";
                                messagesToDelete.push(confirmation);
                                if (confirmed) {
                                    newFlow.triggers[slot - 1] = newTrigger;
                                    messagesToDelete.push(await channel.send({
                                        embeds: [{
                                                title: `✅ Триггер ${slot} был изменён!`,
                                                timestamp: Date.now()
                                            }]
                                    }));
                                }
                                else
                                    messagesToDelete.push(await channel.send({
                                        embeds: [{
                                                title: `✴️ Изменение триггера ${slot} было отменено.`,
                                                timestamp: Date.now()
                                            }]
                                    }));
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                else {
                    if (slot > _1.default.limitActions)
                        messagesToDelete.push(await channel.send(`❌ Вы можете иметь только ${_1.default.limitActions} действия(-ий) на поток.`));
                    else {
                        messagesToDelete.push(await channel.send({
                            embeds: [{
                                    title: `📝 Выберите действие на слот ${slot}`,
                                    description: "0 - **Очистить**\n\n" +
                                        allActions.map((action, index) => `${index + 1} - **${action.short}**${action.long ? `\n${action.long}` : ""}`).join("\n\n"),
                                    timestamp: Date.now()
                                }]
                        }));
                        const selections = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 1800000, errors: ["time"] });
                        const selection = selections.first(), newActionIndex = parseInt(selection.content);
                        messagesToDelete.push(selection);
                        if (newActionIndex == 0) {
                            newFlow.actions[slot - 1] = null;
                            messagesToDelete.push(await channel.send({
                                embeds: [{
                                        title: `✅ Действие ${slot} очищено!`,
                                        timestamp: Date.now()
                                    }]
                            }));
                        }
                        else if (!newActionIndex || newActionIndex > allActionTypes.length)
                            messagesToDelete.push(await channel.send("✴️ Неверное действие. Отменено."));
                        else {
                            let action = allActions[newActionIndex - 1], newAction = {
                                type: allActionTypes[newActionIndex - 1],
                                data: []
                            };
                            for (const property of action.properties) {
                                messagesToDelete.push(await channel.send({
                                    embeds: [{
                                            title: `✏️ Укажите ${property.short}`,
                                            description: property.help || undefined,
                                            timestamp: Date.now()
                                        }]
                                }));
                                const values = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 1800000, errors: ["time"] });
                                const value = values.first(), convertedValue = await property.convert(value.content, { guild });
                                messagesToDelete.push(value);
                                if (convertedValue == null) {
                                    messagesToDelete.push(await channel.send({
                                        embeds: [{
                                                title: "❌ Неверное значение. Изменение действия отменено.",
                                                timestamp: Date.now()
                                            }]
                                    }));
                                    break;
                                }
                                else
                                    newAction.data.push(convertedValue);
                            }
                            ;
                            if (newAction.data.length == action.properties.length) {
                                messagesToDelete.push(await channel.send({
                                    embeds: [{
                                            title: `💨 Подтвердите действие ${slot}`,
                                            description: [
                                                "**Это правильно? Напишите `да` или `нет`.**",
                                                `${(await formatExplanation(newAction)).split("\n").map((l) => `> ${l}`).join("\n")}`
                                            ].join("\n"),
                                            timestamp: Date.now()
                                        }]
                                }));
                                const confirmations = await channel.awaitMessages({ filter: (m) => m.author.id == author.id, max: 1, time: 1800000, errors: ["time"] });
                                const confirmation = confirmations.first(), confirmed = confirmation.content.toLowerCase() == "да";
                                messagesToDelete.push(confirmation);
                                if (confirmed) {
                                    newFlow.actions[slot - 1] = newAction;
                                    messagesToDelete.push(await channel.send({
                                        embeds: [{
                                                title: `✅ Действие ${slot} было изменено!`,
                                                timestamp: Date.now()
                                            }]
                                    }));
                                }
                                else
                                    messagesToDelete.push(await channel.send({
                                        embeds: [{
                                                title: `✴️ Изменение действия ${slot} было отменено.`,
                                                timestamp: Date.now()
                                            }]
                                    }));
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            else if (command == "save") {
                if (newFlow.triggers.find((t) => t) && newFlow.actions.find((a) => a)) {
                    editing = false;
                    successStatus = true;
                }
                else
                    messagesToDelete.push(await channel.send("❌ Вы должны указать как минимум один триггер и одно действие!"));
            }
            else if (command == "cancel")
                editing = false;
            else if (["help", "?"].includes(command))
                messagesToDelete.push(await channel.send(`🔗 Проверьте закреплённое сообщение для помощи! ${pinned.url}`));
            else
                messagesToDelete.push(await channel.send("❌ Неверный запрос. Посмотрите закреплённое сообщение для помощи!"));
            if (editing)
                setTimeout(() => channel.bulkDelete(messagesToDelete), 5000);
        }
        catch (e) {
            editing = false;
            console.log(e);
        }
        ;
    }
    ;
    return successStatus;
}
exports.flowWalkthrough = flowWalkthrough;
