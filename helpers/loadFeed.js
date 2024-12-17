import {showParticles} from '../utils/showParticles.js'
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

export default loadFeed