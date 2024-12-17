import  loadConversationDetails  from './loadConversationDetails.js';
import {formatDate} from '../utils/formatDate.js';

const loadMessaging = (content, messagesData) => {
    const conversations = [
        { name: 'John Doe', file: './mocks/john_doe_messages.json', avatar: '../assets/john_doe_ava.png' },
        { name: 'Alain Smith', file: './mocks/alain_smith_messages.json', avatar: '../assets/alain_smith_ava.png' }
    ];

    const conversationsDiv = document.createElement('div');
    conversationsDiv.id = 'conversations';

    conversations.forEach(conversation => {
        console.log('conversation', conversation)
        fetch(conversation.file)
            .then(response => response.json())
            .then(messages => {
                messagesData[conversation.name] = messages;
                const lastMessage = messages.reduce((latest, message) => {
                    return new Date(message.datetime) > new Date(latest.datetime) ? message : latest;
                });

                const conversationElement = document.createElement('div');
                conversationElement.className = 'conversation';
                conversationElement.innerHTML = `
                    <div class="conversation-header">
                        <img src="${conversation.avatar}" alt="${conversation.name}" class="avatar">
                        <h3>${conversation.name}</h3>
                    </div>
                    <div class="message-preview">
                        <p>${lastMessage.text}</p>
                        <span class="datetime">${formatDate(new Date(lastMessage.datetime))}</span>
                    </div>
                `;
                conversationElement.addEventListener('click', () => {
                    console.log('Conversation clicked:', conversation.name);
                    loadConversationDetails(content, conversation, messagesData, formatDate);
                });
                conversationsDiv.appendChild(conversationElement);
            });
    });

    content.innerHTML = '';
    content.appendChild(conversationsDiv);
}

export default loadMessaging