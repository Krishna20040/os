bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id;

    // Check if user is an admin
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "🚫 *Unauthorized access.* You are not an admin.");
        return;
    }

    // Ask for target user's chat ID
    bot.sendMessage(chatId, "🔍 Please enter the user's chat ID you want to set the subscription for:");

    bot.once('message', (msg) => {
        const targetChatId = parseInt(msg.text);

        // Ask for subscription duration
        bot.sendMessage(chatId, "📅 Enter the subscription duration (3, 7, or 15 days):");

        bot.once('message', (msg) => {
            const duration = parseInt(msg.text);
            let price = 0;

            // Determine price based on duration
            if (duration === 3) price = 1500;
            else if (duration === 7) price = 6000;
            else if (duration === 15) price = 11000;
            else {
                bot.sendMessage(chatId, "❌ Invalid duration. Please enter 3, 7, or 15.");
                return;
            }

            // Ask for confirmation
            bot.sendMessage(chatId, `
🔔 You are about to set a *${duration}-day* subscription for user with chat ID: *${targetChatId}*.
✍️ Confirm by typing 'Yes' to proceed or 'No' to cancel.
            `);

            bot.once('message', (msg) => {
                if (msg.text.toLowerCase() === 'yes') {
                    saveSubscription(targetChatId, `Premium ${duration} days`, duration);
                    bot.sendMessage(chatId, `✅ Subscription for user *${targetChatId}* has been successfully set for *${duration} days*.`);
                } else {
                    bot.sendMessage(chatId, "❌ Subscription process canceled.");
                }
            });
        });
    });
});