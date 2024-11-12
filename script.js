const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

// Replace with your bot's API token
const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for the /start command and show the menu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  // Send a message with the menu
  bot.sendMessage(chatId,
    `✨ **Welcome to Our Information Bot!** ✨

  ⚙️*Basic commands:*
  📱 **/mobileVerify** ==> Get the mobile owner’s name.
  🚗 **/vehicle** ==> Retrieve vehicle owner details.
  💳 **/upiVerify** ==> Fetch UPI owner information.
  🏦 **/bankaccount** ==> Get bank account owner details.
  🏦 **/deposite** ==> Here you can deposite your money.
  🏦 **/balance** ==> here you can check your balance.
  🆔 **/mychatid** = Its need for Your activation that prediction.
  
  🔗 **Stay Updated**: Join our channel for the latest updates.  
💬 **Need Assistance?** For balance inquiries, contact [@MasterKahna](https://t.me/MasterKahna).`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Join Channel", url: "https://t.me/KahnaXploit" }
          ],
          [
            { text: "Contact for Balance", url: "https://t.me/MasterKahna" }
          ]
        ]
      }
    }
  );

});



// Optional: Handle each button's specific command
const userFile = './users.json';
const apiKey = 'T1gwLTBnRWpJZ2EzaHdxcGc2LjNjY2ExZWU3NzhiZTc0Y2FkNTJiOTM2MWNkMzQ4ZThhOjliOTc4NWMxOGI4NDBiYjY3Y2QyNzE0YzlmNTA4MDU4ZTgwN2VmOGU4MWZmZmZiNg=='; // Replace with your API key

// Listen for /mobileVerify command
bot.onText(/\/mobileVerify/, (msg) => {
  const chatId = msg.chat.id;

  // Ask the user for their mobile number


  bot.sendMessage(chatId, "Its charge *20* Rupees from your account");
  bot.sendMessage(chatId, "Please enter your mobile number for verification. dont add +91");

  // Listen for the next message (the mobile number)
  bot.once('message', async (response) => {
    const mobileNumber = response.text;

    // Load users.json and check the user's balance
    fs.readFile(userFile, 'utf8', (err, data) => {
      if (err) {
        return bot.sendMessage(chatId, "Error reading user data.");
      }

      let users = JSON.parse(data);
      let user = users[chatId]; // Using chatId as the user identifier

      if (!user || user.balance < 20) {
        // Insufficient funds
        return bot.sendMessage(chatId, "Insufficient balance. Please contact customer support for loading money. @MasterKahna");
      }

      // Deduct 20 from user's balance
      user.balance -= 20;

      // Save the updated balance back to the file
      fs.writeFile(userFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return bot.sendMessage(chatId, "Error updating user balance.");
        }

        // Make API request to check the mobile owner
        verifyMobileOwner(mobileNumber, chatId);
      });
    });
  });
});

// Function to verify the mobile owner by making an API call
async function verifyMobileOwner(mobileNumber, chatId) {
  try {
    const apiUrl = 'https://api.attestr.com/api/v1/public/checkx/mobile-owner';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${apiKey}`
    };
    const body = {
      number: mobileNumber
    };

    // Make the API call using axios
    const response = await axios.post(apiUrl, body, { headers });

    // Send the API result to the user
    console.log(response.data)
    if (response.data && response) {
      const ownerInfo = response.data; // Extract the owner information

      // Format the JSON with indentation for better readability
      const formattedOwnerInfo = JSON.stringify(ownerInfo, null, 2);

      // Create a message with Markdown styling for better readability in chat
      const message = `*Mobile Owner Info:*\n\`\`\`json\n${formattedOwnerInfo}\n\`\`\``;

      // Send the message to the chat
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    }
    else {
      bot.sendMessage(chatId, "Failed to verify the mobile number.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Error occurred during verification.");
  }
}


bot.onText(/\/vehicle/, (msg) => {
  const chatId = msg.chat.id;

  // Ask the user for vehicle information (registration number)

  bot.sendMessage(chatId, "Its charge *30* Rupees from your account");
  bot.sendMessage(chatId, "Please provide your vehicle registration number (e.g., TN12XX2345):");

  // Listen for the user's response (the vehicle registration number)
  bot.once('message', async (response) => {
    const vehicleRegNo = response.text;

    fs.readFile(userFile, 'utf8', (err, data) => {
      if (err) {
        return bot.sendMessage(chatId, "Error reading user data.");
      }

      let users = JSON.parse(data);
      let user = users[chatId]; // Using chatId as the user identifier

      if (!user || user.balance < 30) {
        // Insufficient funds
        return bot.sendMessage(chatId, "Insufficient balance. Please contact customer support for loading money. @MasterKahna");
      }

      // Deduct 20 from user's balance
      user.balance -= 30;

      // Save the updated balance back to the file
      fs.writeFile(userFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return bot.sendMessage(chatId, "Error updating user balance.");
        }

        // Make API request to check the mobile owner
        verifyVehicleDetails(vehicleRegNo, chatId);
      });
    });
  });
});

// Function to verify vehicle details by making an API call
async function verifyVehicleDetails(vehicleRegNo, chatId) {
  try {
    const apiUrl = 'https://api.attestr.com/api/v2/public/checkx/rc';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${apiKey}`
    };
    const body = {
      reg: vehicleRegNo
    };

    // Make the API call using axios
    const response = await axios.post(apiUrl, body, { headers });
    console.log(response.data)

    // Send the API result to the user
    if (response.data && response) {
      const vehicleData = response.data; // Extract the vehicle data

      // Format the JSON with indentation for better readability
      const formattedVehicleData = JSON.stringify(vehicleData, null, 2);

      // Create a message with Markdown styling for better readability in chat
      const message = `*Vehicle Data:*\n\`\`\`json\n${formattedVehicleData}\n\`\`\``;

      // Send the message to the chat
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } else {
      bot.sendMessage(chatId, "Vehicle information not found or an error occurred during verification.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Error occurred during vehicle verification. Please try again later.");
  }
}


//upi
bot.onText(/\/upiVerify/, (msg) => {
  const chatId = msg.chat.id;

  // Ask for UPI ID

  bot.sendMessage(chatId, "Its charge *20* Rupees from your account");
  bot.sendMessage(chatId, "Please enter your UPI ID for verification.");

  // Listen for the UPI ID
  bot.once('message', (response) => {
    const upiId = response.text; // Get the UPI ID from user input

    // Call the function to verify UPI ID

    fs.readFile(userFile, 'utf8', (err, data) => {
      if (err) {
        return bot.sendMessage(chatId, "Error reading user data.");
      }

      let users = JSON.parse(data);
      let user = users[chatId]; // Using chatId as the user identifier

      if (!user || user.balance < 20) {
        // Insufficient funds
        return bot.sendMessage(chatId, "Insufficient balance. Please contact customer support for loading money. @MasterKahna");
      }

      // Deduct 20 from user's balance
      user.balance -= 20;

      // Save the updated balance back to the file
      fs.writeFile(userFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return bot.sendMessage(chatId, "Error updating user balance.");
        }

        // Make API request to check the mobile owner
        verifyUPI(upiId, chatId);
      });
    });
  });
});

// Function to verify the UPI ID by making an API call
async function verifyUPI(upiId, chatId) {
  try {
    const apiUrl = 'https://api.attestr.com/api/v1/public/finanx/vpa';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${apiKey}`
    };
    const body = {
      vpa: upiId
    };

    // Make the API call using axios
    const response = await axios.post(apiUrl, body, { headers });

    // Send the API result to the user
    console.log(response.data)
    if (response.data && response) {
      const upidata = response.data;

      // Format the JSON with indentation for better readability
      const formattedUpiData = JSON.stringify(upidata, null, 2);

      const message = `*UPI ID Verified:*\n\`\`\`json\n${formattedUpiData}\n\`\`\``;

      // Send the message to the chat
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
    else {
      bot.sendMessage(chatId, "Failed to verify the UPI ID. Please check the details and try again.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Error occurred while verifying the UPI ID. Please try again later.");
  }
}



//bank

bot.onText(/\/bankaccount/, (msg) => {
  const chatId = msg.chat.id;

  // Ask for the bank account number

  bot.sendMessage(chatId, "Its charge *20* Rupees from your account");
  bot.sendMessage(chatId, "Please provide your bank account number.");

  // Listen for the bank account number
  bot.once('message', (response1) => {
    const accountNumber = response1.text;

    // Ask for the IFSC code
    bot.sendMessage(chatId, "Please provide your IFSC code.");

    // Listen for the IFSC code
    bot.once('message', (response2) => {
      const ifscCode = response2.text;

      // Ask if the user wants to fetch IFSC details (optional)
      bot.sendMessage(chatId, "Do you want to fetch IFSC details? Reply 'yes' or 'no'.");

      // Listen for the response for fetching IFSC details
      bot.once('message', (response3) => {
        const fetchIfsc = response3.text.toLowerCase() === 'yes';

        // Make API request to verify bank details

        fs.readFile(userFile, 'utf8', (err, data) => {
          if (err) {
            return bot.sendMessage(chatId, "Error reading user data.");
          }

          let users = JSON.parse(data);
          let user = users[chatId]; // Using chatId as the user identifier

          if (!user || user.balance < 20) {
            // Insufficient funds
            return bot.sendMessage(chatId, "Insufficient balance. Please contact customer support for loading money. @MasterKahna");
          }

          // Deduct 20 from user's balance
          user.balance -= 20;

          // Save the updated balance back to the file
          fs.writeFile(userFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
              return bot.sendMessage(chatId, "Error updating user balance.");
            }

            // Make API request to check the mobile owner
            verifyBankAccount(accountNumber, ifscCode, fetchIfsc, chatId);
          });
        });
      });
    });
  });
});

// Function to verify the bank account by making an API call
async function verifyBankAccount(accountNumber, ifscCode, fetchIfsc, chatId) {
  try {
    const apiUrl = 'https://api.attestr.com/api/v1/public/finanx/acc';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${apiKey}`
    };
    const body = {
      acc: accountNumber,
      ifsc: ifscCode,
      fetchIfsc: fetchIfsc
    };

    // Make the API call using axios
    const response = await axios.post(apiUrl, body, { headers });

    // Send the API result to the user
    console.log(response.data);
    if (response.data && response) {
      const bankdetails = response.data;

      // Format the JSON with indentation for better readability
      const formattedBankDetails = JSON.stringify(bankdetails, null, 2);

      const message = `*Bank Account Verified:*\n\`\`\`json\n${formattedBankDetails}\n\`\`\``;

      // Send the message to the chat
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
    else {
      bot.sendMessage(chatId, "Failed to verify the bank account details.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Error occurred while verifying the bank account.");
  }
}


bot.onText(/\/deposit/, (msg) => {
  bot.sendMessage(msg.chat.id, "Please proceed to deposit funds.");
});


//balance
function checkBalance(chatId, callback) {
  fs.readFile(userFile, 'utf8', (err, data) => {
    if (err) {
      callback("Error reading user data.", null);
      return;
    }

    let users = JSON.parse(data);

    // Check if the user's chat ID exists in the file
    if (users[chatId]) {
      const balance = users[chatId].balance;
      callback(null, balance);  // Pass the balance back through the callback
    } else {
      callback("You are not loaded balance contact to owner for loading balance @MasterKahna.", null);  // User does not exist
    }
  });
}

bot.onText(/\/balance/, (msg) => {
  const chatId = msg.chat.id;

  // Use the reusable function to check balance
  checkBalance(chatId, (err, balance) => {
    if (err) {
      bot.sendMessage(chatId, err);
    } else {
      bot.sendMessage(chatId, `Your current balance is: ${balance}`);
    }
  });
});

// get chatid
bot.onText(/\/mychatid/, (msg) => {
  const chatId = msg.chat.id;

  // Send message with a button to copy the chat ID
  bot.sendMessage(chatId, `🆔 *Your activation ID is* => ${chatId}`)
});



//Admin
const adminFile = './admin.json';
bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;

  // Read the admin.json file to verify if the user is an admin
  fs.readFile(adminFile, 'utf8', (err, data) => {
    if (err) {
      return bot.sendMessage(chatId, "Error reading admin data.");
    }

    const admins = JSON.parse(data);

    // Check if the current chat ID is in the list of admins
    if (!admins.includes(chatId)) {
      return bot.sendMessage(chatId, "You are not authorized to use this command.");
    }

    // If the user is an admin, ask for the user chat ID and the amount to add
    bot.sendMessage(chatId, `Welcome to admin!

    *basic commands* =>

    /admin = you can add funds.
    /viewUsers = you can see all users.
    /deleteUser = you can delete user.

    `);
    bot.sendMessage(chatId, "Please enter the chat ID of the user you want to add balance to:");

    // Listen for the admin's response (user chat ID)
    bot.once('message', (response1) => {
      const targetChatId = response1.text; // Target user chat ID

      // Ask for the amount to add
      bot.sendMessage(chatId, "Please enter the amount to add:");

      // Listen for the admin's response (amount)
      bot.once('message', (response2) => {
        const amountToAdd = parseFloat(response2.text); // Convert the input to a number

        if (isNaN(amountToAdd) || amountToAdd <= 0) {
          return bot.sendMessage(chatId, "Invalid amount. Please provide a valid number.");
        }

        // Load users.json to update the balance
        fs.readFile(userFile, 'utf8', (err, data) => {
          if (err) {
            return bot.sendMessage(chatId, "Error reading user data.");
          }

          let users = JSON.parse(data);

          // Check if the user exists in the file
          if (users[targetChatId]) {
            // If the user exists, add the new balance to their current balance
            users[targetChatId].balance += amountToAdd;
          } else {
            // If the user doesn't exist, create a new entry with the specified balance
            users[targetChatId] = { balance: amountToAdd };
          }

          // Save the updated users.json file
          fs.writeFile(userFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
              return bot.sendMessage(chatId, "Error updating user balance.");
            }

            // Send confirmation to the admin
            bot.sendMessage(chatId, `Successfully added ${amountToAdd} to user with chat ID ${targetChatId}.`);
          });
        });
      });
    });
  });
});

function isAdmin(chatId, callback) {
  fs.readFile(adminFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading admin data:", err);
      callback(false);
      return;
    }
    const admins = JSON.parse(data);
    callback(admins.includes(chatId));
  });
}

// Command to view all users and their balances
bot.onText(/\/viewUsers/, (msg) => {
  const chatId = msg.chat.id;

  isAdmin(chatId, (isAdmin) => {
    if (!isAdmin) {
      return bot.sendMessage(chatId, "You are not authorized to use this command.");
    }

    // Load users.json to display all users and their balances
    fs.readFile(userFile, 'utf8', (err, data) => {
      if (err) {
        return bot.sendMessage(chatId, "Error reading user data.");
      }

      const users = JSON.parse(data);
      if (Object.keys(users).length === 0) {
        return bot.sendMessage(chatId, "No users found.");
      }

      let userList = "All users and their balances:\n";
      for (let userId in users) {
        userList += `User ID: ${userId}, Balance: ${users[userId].balance}\n`;
      }

      bot.sendMessage(chatId, userList);
    });
  });
});

// Command to delete a user by chat ID
bot.onText(/\/deleteUser/, (msg) => {
  const chatId = msg.chat.id;

  isAdmin(chatId, (isAdmin) => {
    if (!isAdmin) {
      return bot.sendMessage(chatId, "You are not authorized to use this command.");
    }

    // Ask for the user chat ID to delete
    bot.sendMessage(chatId, "Please enter the chat ID of the user to delete:");

    bot.once('message', (response) => {
      const targetChatId = response.text.trim(); // User chat ID to delete

      // Load users.json to delete the specified user
      fs.readFile(userFile, 'utf8', (err, data) => {
        if (err) {
          return bot.sendMessage(chatId, "Error reading user data.");
        }

        let users = JSON.parse(data);

        if (!users[targetChatId]) {
          return bot.sendMessage(chatId, "User not found.");
        }

        // Delete the user
        delete users[targetChatId];

        // Save the updated users.json file
        fs.writeFile(userFile, JSON.stringify(users, null, 2), (err) => {
          if (err) {
            return bot.sendMessage(chatId, "Error updating user data.");
          }

          bot.sendMessage(chatId, `User with chat ID ${targetChatId} has been deleted.`);
        });
      });
    });
  });
});


bot.on('polling_error', (error) => {
  console.log(error);  // Log the error details
});
