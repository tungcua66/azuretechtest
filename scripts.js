document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    let friendsData = {};
    let currentConversation = null;
    let messagesData = {}; // Ensure messagesData is defined at the top level

    const loadFeed = () => {
        fetch('./mocks/posts.json')
            .then(response => response.json())
            .then(posts => {
                const feed = document.createElement('div');
                feed.id = 'feed';
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
                        <div class="post-content">
                            <h3>${post.title}</h3>
                            <p>${post.content}</p>
                        </div>
                        <div class="reactions">
                            <button class="like">Like</button>
                            <button class="dislike">Dislike</button>
                            <button class="love">Love</button>
                        </div>
                        <div class="comments">
                            <h4>Comments</h4>
                            <div class="comments-list"></div>
                            <textarea class="comment-input" placeholder="Add a comment..."></textarea>
                            <button class="comment-submit">Submit</button>
                        </div>
                    `;
                    feed.appendChild(postElement);

                    // Add event listeners for reaction buttons
                    postElement.querySelector('.like').addEventListener('click', () => {
                        showParticles(postElement, 'like');
                    });
                    postElement.querySelector('.dislike').addEventListener('click', () => {
                        showParticles(postElement, 'dislike');
                    });
                    postElement.querySelector('.love').addEventListener('click', () => {
                        showParticles(postElement, 'love');
                    });

                    // Add event listener for comment submission
                    postElement.querySelector('.comment-submit').addEventListener('click', () => {
                        const commentInput = postElement.querySelector('.comment-input');
                        const commentText = commentInput.value.trim();
                        if (commentText) {
                            const commentElement = document.createElement('div');
                            commentElement.className = 'comment';
                            commentElement.innerText = commentText;
                            postElement.querySelector('.comments-list').appendChild(commentElement);
                            commentInput.value = '';
                        }
                    });

                    // Add event listener for image click to display in full screen
                    const postImage = postElement.querySelector('.post-image');
                    if (postImage) {
                        postImage.addEventListener('click', () => {
                            const fullScreenOverlay = document.createElement('div');
                            fullScreenOverlay.className = 'full-screen-overlay';
                            fullScreenOverlay.innerHTML = `
                                <img src="${post.image}" alt="${post.title}" class="full-screen-image">
                            `;
                            document.body.appendChild(fullScreenOverlay);

                            // Add event listener to remove full screen overlay on click
                            fullScreenOverlay.addEventListener('click', () => {
                                fullScreenOverlay.remove();
                            });
                        });
                    }
                });
                content.innerHTML = '';
                content.appendChild(feed);
            });
    }

    const showParticles = (element, reaction) => {
        const colors = {
            like: 'blue',
            dislike: 'red',
            love: 'pink'
        };
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = colors[reaction];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particleContainer.appendChild(particle);
        }
        element.appendChild(particleContainer);
        setTimeout(() => {
            particleContainer.remove();
        }, 1000);
    }

    const loadMessaging = () => {
        console.log('messaging is loaded');
        const conversations = [
            { name: 'John Doe', file: './mocks/john_doe_messages.json', avatar: './assets/john_doe_ava.png' },
            { name: 'Alain Smith', file: './mocks/alain_smith_messages.json', avatar: './assets/alain_smith_ava.png' }
        ];

        const conversationsDiv = document.createElement('div');
        conversationsDiv.id = 'conversations';

        conversations.forEach(conversation => {
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
                        currentConversation = conversation;
                        loadConversationDetails(conversation);
                    });
                    conversationsDiv.appendChild(conversationElement);
                });
        });

        content.innerHTML = '';
        content.appendChild(conversationsDiv);
    }

    const loadConversationDetails = (conversation) => {
        console.log('Loading conversation details for:', conversation.name);
        const messages = messagesData[conversation.name];
        const chatDiv = document.createElement('div');
        chatDiv.id = 'chat';
        chatDiv.innerHTML = `
            <h2>${conversation.name}</h2>
            <div id="message-history">
                ${messages.map(message => `
                    <div class="message">
                        <div class="message-content">
                            <img src="${friendsData[message.sender]}" alt="${message.sender}" class="avatar">
                            <p><strong>${message.sender}:</strong> ${message.text}</p>
                            <span class="datetime">${formatDate(new Date(message.datetime))}</span>
                        </div>
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
                messageElement.className = 'message';
                const newMessageData = {
                    sender: 'You',
                    text: newMessage,
                    datetime: new Date().toISOString()
                };
                messageElement.innerHTML = `
                    <div class="message-content">
                        <img src="${friendsData['You']}" alt="You" class="avatar">
                        <p><strong>You:</strong> ${newMessage}</p>
                        <span class="datetime">${formatDate(new Date(newMessageData.datetime))}</span>
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
    }

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const loadFriends = () => {
        fetch('./mocks/friends.json')
            .then(response => response.json())
            .then(friends => {
                friendsData = friends.reduce((acc, friend) => {
                    acc[friend.name] = friend.avatar;
                    return acc;
                }, {});

                const friendsList = document.createElement('ul');
                friendsList.id = 'friends-list';
                friends.forEach(friend => {
                    const friendElement = document.createElement('li');
                    friendElement.className = 'friend';
                    friendElement.innerHTML = `
                        <img src="${friend.avatar}" alt="${friend.name}" class="avatar">
                        <span>${friend.name}</span>
                        <button class="message">Message</button>
                    `;
                    friendsList.appendChild(friendElement);
                });
                content.innerHTML = '';
                content.appendChild(friendsList);

                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.id = 'search';
                searchInput.placeholder = 'Search friends...';
                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchTerm));
                    friendsList.innerHTML = '';
                    filteredFriends.forEach(friend => {
                        const friendElement = document.createElement('li');
                        friendElement.className = 'friend';
                        friendElement.innerHTML = `
                            <img src="${friend.avatar}" alt="${friend.name}" class="avatar">
                            <span>${friend.name}</span>
                            <button class="message">Message</button>
                        `;
                        friendsList.appendChild(friendElement);
                    });
                });
                content.prepend(searchInput);
            })
            .catch(error => console.error('Error fetching friends:', error));
    }

    const loadPage = (page) => {
        console.log('page', page);
        if (page === 'feed') {
            loadFeed();
        } else if (page === 'messaging') {
            console.log('messaging is loaded');
            loadMessaging();
        } else if (page === 'friends') {
            loadFriends();
        }
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Load the default page (feed) on initial load
    loadPage('feed');
});