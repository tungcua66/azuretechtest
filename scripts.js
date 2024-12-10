document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

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
        fetch('./mocks/conversations.json')
            .then(response => response.json())
            .then(conversations => {
                const conversationsDiv = document.createElement('div');
                conversationsDiv.id = 'conversations';
                conversations.forEach(conversation => {
                    const conversationElement = document.createElement('div');
                    conversationElement.className = 'conversation';
                    conversationElement.innerHTML = `
                        <h3>${conversation.name}</h3>
                        <p>${conversation.lastMessage}</p>
                    `;
                    conversationsDiv.appendChild(conversationElement);
                });
                content.innerHTML = '';
                content.appendChild(conversationsDiv);
            });
    }

    const loadFriends = () => {
        fetch('./mocks/friends.json')
            .then(response => response.json())
            .then(friends => {
                const friendsList = document.createElement('ul');
                friendsList.id = 'friends-list';
                friends.forEach(friend => {
                    const friendElement = document.createElement('li');
                    friendElement.className = 'friend';
                    friendElement.innerHTML = `
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