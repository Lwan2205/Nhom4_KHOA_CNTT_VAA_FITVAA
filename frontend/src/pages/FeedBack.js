import React, { useState } from 'react';
import "../assets/css/FeedBack.css"

const FeedBack = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [feedBack, setFeedBack] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form data
        if (!username || !email || !address || !feedBack) {
            setMessage('Please fill all the fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8000/api/review/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    address,
                    feedBack,
                }),
            });

            if (!response.ok) {
                throw new Error('Error submitting feedback');
            }

            const result = await response.json();
            setMessage('Feedback submitted successfully!');
            setUsername('');
            setEmail('');
            setAddress('');
            setFeedBack('');
        } catch (error) {
            setMessage('Error submitting feedback, please try again later.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="feedback-form-container">
            <h2>Submit Your Feedback</h2>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Your Name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Your Email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Your Address"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="feedBack">Feedback</label>
                    <textarea
                        id="feedBack"
                        value={feedBack}
                        onChange={(e) => setFeedBack(e.target.value)}
                        required
                        placeholder="Write your feedback here"
                    ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}

export default FeedBack
