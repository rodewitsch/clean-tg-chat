// clean_chat.js
const fs = require('fs');

function cleanMessage(message) {
  const cleaned = {
    id: message.id,
    date: message.date,
    from: message.from,
    text: ''
  };

  // reply_to_message_id для структуры диалога
  if (message.reply_to_message_id) {
    cleaned.reply_to_message_id = message.reply_to_message_id;
  }

  // Извлекаем текст
  if (typeof message.text === 'string') {
    cleaned.text = message.text;
  } else if (Array.isArray(message.text)) {
    const textParts = message.text.map(item => {
      if (typeof item === 'string') {
        return item;
      } else if (item && typeof item === 'object' && item.text) {
        return item.text;
      }
      return '';
    }).filter(part => part.trim() !== '');
    
    cleaned.text = textParts.join('\n');
  }

  // Сохраняем реакции с информацией о том, кто поставил
  if (message.reactions && Array.isArray(message.reactions)) {
    cleaned.reactions = message.reactions
      .filter(r => r.type === 'emoji')
      .map(reaction => ({
        emoji: reaction.emoji,
        users: reaction.recent?.map(user => ({
          name: user.from,
          id: user.from_id,
          date: user.date
        })) || []
      }));
    
    // Если нет пользователей в recent, но есть общее количество
    cleaned.reactions.forEach(reaction => {
      if (reaction.users.length === 0 && reaction.count) {
        reaction.count = reaction.count;
      }
    });
  }

  return cleaned;
}

function processChat() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Использование: node clean_chat.js <input.json> [output.json]');
    console.log('Пример: node clean_chat.js result.json clean.json');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || 'clean_chat.json';

  try {
    if (!fs.existsSync(inputFile)) {
      console.error(`Файл ${inputFile} не найден`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    const cleanedData = {
      name: data.name,
      type: data.type,
      messages: []
    };
    
    if (Array.isArray(data.messages)) {
      cleanedData.messages = data.messages
        .filter(msg => msg.type === 'message')
        .map(cleanMessage)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(cleanedData, null, 2), 'utf8');
    
    console.log('✅ Готово!');
    console.log(`📁 Сохранено в: ${outputFile}`);
    console.log(`💬 Сообщений: ${cleanedData.messages.length}`);
    
    // Статистика
    const users = {};
    let replies = 0;
    let reactionsCount = 0;
    let reactionsWithUsers = 0;
    
    cleanedData.messages.forEach(msg => {
      users[msg.from] = (users[msg.from] || 0) + 1;
      if (msg.reply_to_message_id) replies++;
      if (msg.reactions) {
        msg.reactions.forEach(reaction => {
          reactionsCount++;
          if (reaction.users && reaction.users.length > 0) {
            reactionsWithUsers++;
          }
        });
      }
    });
    
    console.log(`👥 Участников: ${Object.keys(users).length}`);
    console.log(`↪️  Ответов: ${replies}`);
    console.log(`😀 Реакций: ${reactionsCount} (${reactionsWithUsers} с информацией о пользователях)`);
    
    // Пример реакций
    const messagesWithReactions = cleanedData.messages.filter(msg => msg.reactions && msg.reactions.length > 0);
    if (messagesWithReactions.length > 0) {
      console.log('\nПример реакций:');
      const sample = messagesWithReactions[0];
      sample.reactions.forEach((reaction, i) => {
        console.log(`  ${reaction.emoji}: ${reaction.users.map(u => u.name).join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

processChat();