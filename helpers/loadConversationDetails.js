import {formatDate} from '../utils/formatDate.js'
const loadConversationDetails = (content, conversation, messagesData) => {

    const messages = messagesData[conversation.name] || [];
    fetch(conversation.file)
        .then(response => response.json())
        .then(fetchedMessages => {
            console.log('hi', fetchedMessages)
            messagesData[conversation.name] = fetchedMessages;
            const chatDiv = document.createElement('div');
            chatDiv.id = 'chat';
            chatDiv.innerHTML = `
                <h2>${conversation.name}</h2>
                <div id="message-history">
                    ${fetchedMessages.map(message => `
                        <div class="message ${message.sender === 'You' ? 'message-right' : 'message-left'}">
                                <span class="datetime">${formatDate(new Date(message.datetime))}</span>
                                ${message.sender !== 'You' ? `<img src="${conversation.avatar}" alt="${message.sender}" class="avatar">` : '<div></div>'}
                                <p><strong>${message.sender}:</strong> ${message.text}</p>
                        </div>
                    `).join('')}
                </div>
                <textarea id="new-message" placeholder="Type your message..."></textarea>
                <button id="send-message">Send</button>
            `;
            content.innerHTML = '';
            content.appendChild(chatDiv);

            document.getElementById('send-message').addEventListener('click', () => {
                const newMessage = document.getElementById('new-message').value.trim();
                if (newMessage) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message message-right';
                    const newMessageData = {
                        sender: 'You',
                        text: newMessage,
                        datetime: new Date().toISOString()
                    };
                    messageElement.innerHTML = `
                        <div class="message-right">
                            <span class="datetime">${formatDate(new Date(newMessageData.datetime))}</span>
                            <p><strong>You:</strong> ${newMessage}</p>
                        </div>
                    `;
                    document.getElementById('message-history').appendChild(messageElement);
                    document.getElementById('new-message').value = '';

                    // Simulate adding the message to the JSON file
                    messagesData[conversation.name].push(newMessageData);

                    // Send the new message to the server to update the JSON file
                    fetch('/add-message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            conversation: conversation.name,
                            message: newMessageData
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            });
        });
}

export default loadConversationDetails